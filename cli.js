#!/usr/bin/env node
'use strict'

const fs = require('fs')
const path = require('path')
const find = require('array-find')
const Q = require('bluebird-q')
const vorpal = require('vorpal')()
const repl = require('vorpal-repl')
const mkdirp = require('mkdirp')
const debug = require('debug')('tradle-cli')
const leveldown = require('leveldown')
const constants = require('@tradle/constants')
const Identity = require('@tradle/identity').Identity
const DSA = require('@tradle/otr').DSA
const Builder = require('@tradle/chained-obj').Builder
const WebSocketClient = require('@tradle/ws-client')
const HttpClient = require('@tradle/transport-http').HttpClient
const TYPE = constants.TYPE
const ROOT_HASH = constants.ROOT_HASH
const CUR_HASH = constants.CUR_HASH
const SIG = constants.SIG
const buildNode = require('./buildNode')
const DEV = process.env.NODE_ENV === 'development'
const manualTxs = [
  // safe
  'a605b1b60a8616a7e145834e1831d498689eb5fc212d1e8c11c45a27ea59b5f8',
  // easy
  '0080491d1b9d870c6dcc8a60f87fa0ba1fcc617f76e8f414ecb1dd86188367a9',
  // europi
  '90c357e9f37a95d849677f6048838bc70a6694829c30988add3fe16af38955ac',
  // friendly
  '235f8ffd7a3f5ecd5de3408cfaad0d01a36a96195ff491850257bc5c3098b28b'
]

let baseStoragePath = path.resolve('./storage')
mkdirp.sync(baseStoragePath)

let storagePath = baseStoragePath + '/bill'
let identity
let keys
let tim

runDefault()

function runDefault () {
  identity = require('./test/fixtures/bill-pub')
  keys = require('./test/fixtures/bill-priv')
  tim = buildNode({
    pathPrefix: storagePath,
    networkName: 'testnet',
    identity: Identity.fromJSON(identity),
    keys: keys,
    syncInterval: 300000,
    afterBlockTimestamp: constants.afterBlockTimestamp
  })

  tim.watchTxs(manualTxs)

  tim.on('message', (info) => {
    console.log(`received ${info[TYPE]} with hash: ${info[CUR_HASH]}`)
  })

  tim.on('unchained', (info) => {
    console.log(`detected transaction sealing ${info[TYPE]} with hash: ${info[CUR_HASH]}`)
  })

  let otrKey = find(keys, (k) => {
    return k.type === 'dsa'
  })

  if (!otrKey) {
    this.log('no OTR key found')
    return cb()
  }

  let transport = new WebSocketClient({
    url: 'http://127.0.0.1:44444/ws/easy',
    otrKey: DSA.parsePrivate(otrKey.priv)
  })

  transport.on('message', tim.receiveMsg)
  tim._send = transport.send.bind(transport)
}

vorpal
  .delimiter('tradle$')
  // .use(repl)
  .show()

vorpal
  .command('setuser <pathToIdentity> <pathToKeys>', 'Set acting identity')
  .action(function (args, cb) {
    if (tim) {
      this.log('please exit and re-enter')
      return cb()
    }

    let iPath = path.resolve(args.pathToIdentity)
    let kPath = path.resolve(args.pathToKeys)
    try {
      identity = require(iPath)
    } catch (err) {
      this.log(err.message)
      return cb()
    }

    try {
      keys = require(kPath)
    } catch (err) {
      this.log(err.message)
      return cb()
    }

    tim = buildNode({
      networkName: 'testnet',
      identity: Identity.fromJSON(identity),
      keys: keys,
      syncInterval: 300000,
      afterBlockTimestamp: constants.afterBlockTimestamp
    })

    cb()
  })

vorpal
  .command('settransport <type> <serverUrl>', 'Set transport: "ws" or "http"')
  .action(function (args, cb) {
    if (!tim) {
      this.log('please run "setuser" first')
      return cb()
    }

    let serverUrl = args.serverUrl
    let transport
    if (args.type === 'ws') {
      let otrKey = find(keys, (k) => {
        return k.type === 'dsa'
      })

      if (!otrKey) {
        this.log('no OTR key found')
        return cb()
      }

      transport = new WebSocketClient({
        url: serverUrl + '/ws',
        otrKey: DSA.parsePrivate(otrKey.value)
      })
    } else if (args.type === 'http') {
      transport = new HttpClient()
      tim.ready().then(() => {
        transport.setRootHash(tim.myRootHash())
      })
    }

    tim._send = transport.send.bind(transport)
    cb()
  })

vorpal
  .command('intro <to>', 'Introduce yourself to to someone')
  .action(function (args, cb) {
    new Builder()
      .data({
        [TYPE]: 'tradle.IdentityPublishRequest',
        identity: identity
      })
      .build()
      .then((buf) => {
        let msg = JSON.parse(buf.toString('binary'))
        return previewSend.call(this, msg)
      })
      .then(msg => {
        return tim.send({
          msg: msg,
          to: [{ fingerprint: args.to }],
          public: true,
          deliver: true
        })
      })
      .then(() => this.log('message queued'))
      .catch(err => this.log(err))
      .finally(cb)
  })

vorpal
  .command('msg <to>', 'Send a message to someone')
  .action(function (args, cb) {
    if (!tim) {
      this.log('please run "setuser" first')
      return cb()
    }

    if (!tim._send) {
      this.log('please run "settransport" first')
      return cb()
    }

    let done
    let opts = {
      deliver: true
    }

    let msg = {}
    let getRecipient = () => {
      let ask
      // if (args.to) {
        ask = Q(args)
      // } else {
      //   ask = this.prompt([
      //     {
      //       type: 'input',
      //       name: 'to',
      //       message: 'enter recipient root hash or a fingerprint of one of their keys '
      //     }
      //   ])
      // }

      return ask
      .then(result => findRecipient(result.to))
      .then(recipient => {
        opts.to = [{ [ROOT_HASH]: recipient[ROOT_HASH] }]
      })
    }

    let constructMessage = () => {
      return this.prompt([
        {
          type: 'input',
          name: 'type',
          message: 'type (tradle.SimpleMessage) ',
          default: 'tradle.SimpleMessage'
        }
      ])
      .then((result) => {
        msg[TYPE] = result.type
        this.log('type: ' + result.type)
        return getProperties()
      })
    }

    let getProperties = () => {
      return this.prompt([
        {
          type: 'confirm',
          name: 'more',
          message: 'Add more properties? (yes) ',
          default: true
        }
      ])
      .then((result) => {
        if (result.more) {
          return getProperty()
            .then(() => getProperties())
        }
      })
    }

    let getProperty = () => {
      return this.prompt([
        {
          type: 'input',
          name: 'name',
          message: 'property name: '
        },
        {
          type: 'input',
          name: 'value',
          message: 'property value: '
        }
      ])
      .then(result => {
        let name = result.name
        let value = result.value
        msg[name] = value
      })
    }

    let maybeSign = () => {
      return this.prompt([
        {
          type: 'confirm',
          name: 'sign',
          message: 'sign the message? (yes) ',
          default: true
        }
      ])
      .then((result) => {
        if (!result.sign) return

        return tim.sign(msg)
          .then(signed => {
            msg = JSON.parse(signed.toString('binary'))
            this.log('sig: ' + msg[SIG])
          })
      })
    }

    let build = () => {
      return Builder()
        .data(msg)
        .build()
    }

    getRecipient()
      .then(constructMessage)
      .then(maybeSign)
      .then(() => previewSend.call(this, msg))
      .then(build)
      .then((buf) => {
        opts.msg = buf
        return tim.send(opts)
      })
      .then((entries) => {
        this.log('message queued')
        let rh = entries[0].get(ROOT_HASH)
        let sentHandler = (info) => {
          if (info[ROOT_HASH] === rh) {
            this.log('delivered message with hash ' + rh)
            tim.removeListener('sent', sentHandler)
          }
        }

        tim.on('sent', sentHandler)
      }, (err) => {
        this.log(err.message)
      })
      .then(() => cb())
      .catch(err => {
        this.log(err)
        cb()
      })
  })
  // .cancel(function () {
  //   this.log('message canceled');
  // })

vorpal
  .command('ls [type]', 'List resources by type, e.g. `ls tradle.Identity`')
  .action(function (args, cb) {
    if (!tim) {
      this.log('please run "setuser" first')
      return cb()
    }

    let results = []
    let err
    tim.decryptedMessagesStream()
      .on('data', (data) => {
        if (!args.type || args.type.includes(data[TYPE])) {
          results.push(data[CUR_HASH])
        }
      })
      .on('error', (e) => err = e)
      .on('end', () => {
        if (err) this.log(err)
        else results.forEach(r => this.log(r))

        cb()
      })
  })

vorpal
  .command('show <hash>', 'Print a stored object')
  .option('-v, --verbose', 'Print all metadata as well.')
  .action(function (args, cb) {
    if (!tim) {
      this.log('please run "setuser" first')
      return cb()
    }

    tim.lookupObjectByCurHash(args.hash)
      .then(obj => {
        obj = args.options.verbose ? obj : obj.parsed.data
        this.log(prettify(obj))
      })
      .catch(err => this.log(err))
      .finally(cb)
  })

vorpal
  .command('watchTx <hash>', 'Watch a blockchain transaction')
  .action(function (args, cb) {
    if (!tim) {
      this.log('please run "setuser" first')
      return cb()
    }

    tim.watchTxs(args.hash)
    cb()
  })

vorpal
  .command('watchAddr <address>', 'Watch a blockchain address')
  .action(function (args, cb) {
    if (!tim) {
      this.log('please run "setuser" first')
      return cb()
    }

    tim.watchAddresses(args.address)
    cb()
  })

vorpal
  .command('forget <identifier>', 'Forget someone (wipe all history with them)')
  .action(function (args, cb) {
    if (!tim) {
      this.log('please run "setuser" first')
      return cb()
    }

    findRecipient(args.identifier)
      .then(r => tim.forget(r[ROOT_HASH]))
      .then(() => this.log('forgot ' + args.identifier))
      .catch(err => this.log(err))
      .finally(cb)
  })

vorpal
  .command('stop', 'Call this before exiting to give things a chance to clean up nicely')
  .action(function (args, cb) {
    if (!tim) return cb()

    tim
      .destroy()
      .catch(err => this.log(err))
      .finally(cb)
  })

vorpal
  .find('exit')
  .description('Exit Tradle command line client. Please run `stop` first')

function printIdentityPublishStatus (tim) {
  tim.identityPublishStatus()
    .then((status) => {
      let msg = 'identity status: '
      if (status.current) msg += 'published latest'
      else if (status.queued) msg += 'queued for publishing'
      else if (!status.ever) msg += 'unpublished'
      else msg += 'published, needs republish'

      console.log(msg)
    })
    .catch((err) => {
      console.error('failed to get identity status', err.message)
    })
}

function cleanup () {
  if (selfDestructing) return

  selfDestructing = true
  debug('cleaning up before shut down...')
  tim.destroy()
    .done(() => {
      debug('shutting down')
      process.exit()
    })
}

function prettify (obj) {
  return JSON.stringify(obj, prettifyReplacer, 2)
}

function prettifyReplacer (key, val) {
  if (Buffer.isBuffer(val)) {
    return val.toString('hex')
  }

  if (Object.keys(val).length === 2 && val.type === 'Buffer' && Array.isArray(val.data)) {
    return prettifyReplacer(key, new Buffer(val.data))
  }

  if (typeof val === 'object') {
    return val
  }

  return val
}

function findRecipient (identifier) {
  return Q.allSettled([
    tim.lookupIdentity({ fingerprint: identifier }),
    tim.lookupIdentity({ [ROOT_HASH]: identifier })
  ])
  .then(results => {
    for (let i = 0; i < results.length; i++) {
      let r = results[i]
      if (r.value) return r.value
    }

    throw new Error('recipient not found')
  })
}

function previewSend (msg) {
  return this.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: `About to send \n${prettify(msg)}\n\nIs this OK? (yes)`,
      default: true
    }
  ])
  .then((result) => {
    if (!result.confirm) {
      throw new Error('send aborted')
    }

    return msg
  })
}

