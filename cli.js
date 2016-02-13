#!/usr/bin/env node
'use strict'

if (!('DEBUG' in process.env)) {
  process.env.DEBUG = '*'
}

const fs = require('fs')
const path = require('path')
// const spawn = require('child_process').spawn
const find = require('array-find')
const Q = require('bluebird-q')
const bs58check = require('bs58check')
const vorpal = require('vorpal')()
// const repl = require('vorpal-repl')
const mkdirp = require('mkdirp')
const Table = require('cli-table')
const Debug = require('debug')
// const debug = Debug('tradle-cli')
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
const noop = () => {}
Debug.log = noop // initially

const BANNER =
"\n###################################################################################################################\n" +
"#                                                                                                                 #\n" +
"#                                             Welcome to Tradle!                                                  #\n" +
"#                                                                                                                 #\n" +
"###################################################################################################################\n"

const IDENTIFIER_EXPLANATION = '<identifier> can be the other party\'s key fingerprint, root hash or current hash'

// for now
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

console.log(BANNER)

let DEFAULT_STORAGE_PATH = path.resolve('./storage')
let storagePath
let identity
let keys
let tim
let currentMode
let pargv = process.argv.slice(2)

if (pargv.length) {
  // runDefault()
  setUser.call(vorpal, {
    pathToIdentity: pargv[0],
    pathToKeys: pargv[1],
    options: {}
  })

  if (pargv[2]) {
    setTransport.call(vorpal, {
      type: 'ws',
      // 'http://127.0.0.1:44444/ws/easy'
      serverUrl: pargv[2],
      options: {}
    })
  }
}

vorpal
  .delimiter('tradle$')
  .history('tradle-cli')
  // .use(repl)
  .show()
  .on('exitmode', function () {
    currentMode = null
  })

vorpal
  .command('setuser <pathToIdentity> <pathToKeys>', 'Set acting identity')
  .option('-d, --dir', 'Path to storage directory')
  .action(setUser)

vorpal
  .command('settransport <type> <serverUrl>', 'Set transport: "ws" or "http"')
  .action(setTransport)

vorpal
  .command('intro <identifier>', 'Introduce yourself to someone')
  .help(IDENTIFIER_EXPLANATION)
  .action(function (args, cb) {
    let opts = { deliver: true, public: true }

    findRecipient(args.identifier)
    .then((recipient) => {
      opts.to = toCoords(recipient)
      opts.msg = {
        [TYPE]: 'tradle.IdentityPublishRequest',
        identity: identity
      }

      return sendMsg.call(this, opts)
    })

    //   return new Builder()
    //     .data()
    //     .build()
    // })
    // .then((buf) => {
    //   opts.msg = buf
    //   return previewSend.call(this, buf)
    // })
    // .then(() => tim.send(opts))
    // .then(() => this.log('message queued'))
    .catch(err => this.log(err))
    .then(() => cb())
  })

vorpal
  .command('simplemsg <identifier>', 'Send a message to someone')
  // .option('-m, --message', 'Message text')
  // .option('-s, --sign', 'Sign the message (yes)')
  .help(IDENTIFIER_EXPLANATION)
  .action(function (args, cb) {
    if (!canSend.call(this)) return cb()

    let opts = { deliver: true }

    findRecipient(args.identifier)
    .then((recipient) => opts.to = toCoords(recipient))
    .then(() => {
      return this.prompt([
        {
          type: 'input',
          name: 'message',
          message: 'enter your message '
        }
      ])
    })
    .then(result => {
      opts.msg = {
        [TYPE]: 'tradle.SimpleMessage',
        message: result.message
      }

      return sendMsg.call(this, opts)
    })
    .catch(err => this.log(err))
    .then(() => cb())
  })

vorpal
  .command('msg <identifier>', 'Send a message to someone')
  .help(IDENTIFIER_EXPLANATION)
  .action(function (args, cb) {
    if (!canSend.call(this)) return cb()

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
        let msg = {
          [TYPE]: result.type
        }

        this.log('type: ' + result.type)
        return setProperties(msg)
      })
    }

    let setProperties = (msg) => {
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
          return setProperty(msg)
            .then(() => setProperties(msg))
        }

        return msg
      })
    }

    let setProperty = (msg) => {
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
        return msg
      })
    }

    let opts = {
      deliver: true
    }

    findRecipient(args.identifier)
      .then((recipient) => opts.to = toCoords(recipient))
      .then(constructMessage)
      .then((msg) => {
        opts.msg = msg
        return sendMsg.call(this, opts)
      })
      .catch(err => this.log(err))
      .then(() => cb())
  })
  // .cancel(function () {
  //   this.log('message canceled');
  // })

vorpal
  .command('ls', 'List stored resources')
  .option('-t, --type', 'Limit resources by type, e.g. tradle.Identity')
  .action(function (args, cb) {
    if (!tim) {
      this.log('please run "setuser" first')
      return cb()
    }

    let results = []
    let err
    // let cols = ['From', 'To', 'Date', 'TxId']
    // let colWidths = [42, 42, 30, 42]
    let types = args.options.type
    if (types) {
      types = types.split(',')
    }
    // else {
    //   cols.unshift('Type')
    //   colWidths.unshift(20)
    // }

    tim.decryptedMessagesStream()
      .on('data', data => {
        if (!types || types.includes(data[TYPE])) {
          results.push(data)
        }
      })
      .on('error', (e) => {
        err = e
        this.log(err)
        cb() // call here, might not get to 'end'
      })
      .on('end', () => {
        if (err) return

        if (!results.length) {
          this.log('no results found')
        } else {
          // var table = new Table({
          //   head: cols,
          //   colWidths: colWidths
          // })

          // results.forEach(r => {
          //   let date = new Date(r.timestamp)
          //   table.push([
          //     r[TYPE],
          //     r.from ? r.from[ROOT_HASH] : '',
          //     r.to ? r.to[ROOT_HASH] : '',
          //     date.toString(),
          //     r.txId || ''
          //   ])
          // })

          this.log('Tip: use `show <hash>` to get full metadata')
          var table = new Table({
            head: ['Type', 'Hash'],
            colWidths: [45, 45]
          })

          results.forEach(r => {
            let date = new Date(r.timestamp)
            table.push([
              r[TYPE],
              r[CUR_HASH]
            ])
          })

          this.log(table.toString())
        }

        cb()
      })
  })

vorpal
  .command('show <hash>', 'Print a stored object')
  .option('-v, --verbose', 'Print all metadata as well.')
  .action(show)

// vorpal
//   .command('debug <namespaces>', 'Enable debug namespaces')
//   .action(function (args, cb) {
//     Debug.enable(args.namespaces)
//     cb()
//   })

vorpal
  .command('watchTx <hash>', 'Watch a blockchain transaction')
  .action(function (args, cb) {
    if (!tim) {
      this.log('please run "setuser" first')
      return cb()
    }

    try {
      let buf = new Buffer(args.hash, 'hex')
      if (buf.length !== 32) {
        throw new Error('invalid tx hash')
      }
    } catch (err) {
      this.log(err)
      return cb()
    }

    tim.watchTxs(args.hash)
    tim.sync()
    cb()
  })

vorpal
  .command('watchAddr <address>', 'Watch a blockchain address')
  .action(function (args, cb) {
    if (!tim) {
      this.log('please run "setuser" first')
      return cb()
    }

    try {
      bs58check.decode(args.address)
    } catch (err) {
      this.log(err)
      return cb()
    }

    tim.watchAddresses(args.address)
    tim.sync()
    cb()
  })

vorpal
  .command('forget <identifier>', 'Forget someone (wipe all history with them)')
  .help(IDENTIFIER_EXPLANATION)
  .action(function (args, cb) {
    if (!tim) {
      this.log('please run "setuser" first')
      return cb()
    }

    findRecipient(args.identifier)
      .then(r => tim.forget(r[ROOT_HASH]))
      .then(() => this.log('forgot ' + args.identifier))
      .catch(err => this.log(err))
      .then(() => cb())
  })

vorpal
  .command('stop', 'Call this before exiting to give things a chance to clean up nicely')
  .action(function (args, cb) {
    if (!tim) return cb()

    tim
      .destroy()
      .catch(err => this.log(err))
      .then(() => cb())
  })

vorpal
  .command('whoami', 'Print your identity')
  .action(function (args, cb) {
    if (!tim) return cb()

    // return show.call(this, { hash: tim.myCurrentHash() }, cb)
    // tim.lookupObjectByCurHash(tim.myCurrentHash())
    //   .then((obj) => this.log(obj))
    this.log('Current hash: ' + tim.myCurrentHash())
    this.log('Root hash: ' + tim.myRootHash())
    printIdentityPublishStatus(tim)
      .then(() => {
        this.log(prettify(tim.identityJSON))
        cb()
      })
  })

// vorpal
//   .command('tail', 'Tail log')
//   .option('-n', 'Lines to output')
//   .option('-f', 'Follow')
//   .action(function (args, cb) {

//   })

vorpal
  .command('alias <alias> <identifier>', 'Create an alias for a contact')
  .action(function (args, cb) {
    if (!tim) {
      this.log('please run "setuser" first')
      return cb()
    }

    findRecipient(args.identifier)
      .then(() => setAlias(args.alias, args.identifier))
      .catch(err => this.log(err))
      .then(() => cb())
  })

vorpal
  .command('aliases', 'list aliases')
  .action(function (args, cb) {
    this.log(prettify(getAliases()))
    cb()
  })

let chattingWith // hack, need to figure out how to save state in mode
vorpal
  .mode('chat <identifier>')
  .init(function (args, cb) {
    currentMode = 'chat'

    let id = args.identifier
    findRecipient(id)
      .then(recipient => {
        chattingWith = toCoords(recipient)
      })
      .catch(err => this.log(err))
      .then(() => cb())

    tim.on('message', onMessage)
    vorpal.once('exitmode', () => tim.removeListener('message', onMessage))

    function onMessage(info) {
      if (info[TYPE] === 'tradle.SimpleMessage') {
        tim.lookupObject(info)
          .then(obj => this.log('them: ' + obj.parsed.data.message))
      }
    }
  })
  .action(function (msg, cb) {
    buildMsg({
      [TYPE]: 'tradle.SimpleMessage',
      message: msg
    })
    .then(buf => tim.sign(buf))
    .then(signed => {
      return tim.send({
        msg: signed,
        to: chattingWith,
        deliver: true
      })
    })
    .catch(err => this.log(err))
    .then(() => cb())
  })

vorpal
  .catch('[hash]', 'Look up object')
  .action(show)

vorpal
  .find('exit')
  .description('Exit Tradle command line client. Please run `stop` first')

function printIdentityPublishStatus (tim) {
  return tim.identityPublishStatus()
    .then((status) => {
      let msg = 'identity status: '
      if (status.current) msg += 'published latest'
      else if (status.queued) msg += 'queued for publishing'
      else if (!status.ever) msg += 'unpublished'
      else msg += 'published, needs republish'

      vorpal.log(msg)
    })
    .catch((err) => {
      vorpal.log('failed to get identity status', err.message)
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
  identifier = getAlias(identifier) || identifier
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

function toCoords (recipient) {
  return [{ [ROOT_HASH]: recipient[ROOT_HASH] }]
}

function previewSend (msg) {
  let json = Buffer.isBuffer(msg)
    ? JSON.parse(msg.toString('binary'))
    : msg

  return this.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: `About to send \n${prettify(json)}\n\nIs this OK? (yes)`,
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

function maybeSign (msg) {
  return this.prompt([
    {
      type: 'confirm',
      name: 'sign',
      message: 'sign the message? (yes) ',
      default: true
    }
  ])
  .then((result) => {
    if (!result.sign) return msg

    return tim.sign(msg)
      .then(signed => {
        let sig = JSON.parse(signed.toString('binary'))[SIG]
        this.log('sig: ' + sig)
        return signed
      })
  })
}

function buildMsg (msg) {
  return Builder()
    .data(msg)
    .build()
}

function runDefault () {
  setUser.call(vorpal, {
    pathToIdentity: './test/fixtures/bill-pub',
    pathToKeys: './test/fixtures/bill-priv',
    options: {
      dir: path.join(DEFAULT_STORAGE_PATH, 'bill')
    }
  })

  setTransport.call(vorpal, {
    type: 'ws',
    serverUrl: 'http://127.0.0.1:44444/ws/easy'
  })
}

function debug () {
  return console.log.apply(console, arguments)
}

function sendMsg (opts) {
  let msg = opts.msg
  return maybeSign.call(this, msg)
    .then(previewSend.bind(this))
    .then(buildMsg)
    .then((buf) => {
      opts.msg = buf
      return tim.send(opts)
    })
    .then((entries) => {
      this.log('message queued')
      let rh = entries[0].get(ROOT_HASH)
      let sentHandler = (info) => {
        if (info[ROOT_HASH] === rh) {
          this.log(`delivered ${info[TYPE]} with hash ${rh}`)
          tim.removeListener('sent', sentHandler)
        }
      }

      tim.on('sent', sentHandler)
    })
}

function setUser (args, cb) {
  cb = cb || noop
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

  storagePath = args.options.dir || path.join(DEFAULT_STORAGE_PATH, path.basename(iPath).split('.')[0])
  let logsPath = path.resolve(storagePath, 'logs')
  let logPath = path.join(logsPath, 'debug-' + Date.now() + '.log')
  mkdirp.sync(storagePath)
  mkdirp.sync(logsPath)
  let logStream = fs.createWriteStream(logPath, {'flags': 'a'})

  Debug.enable()
  Debug.log = function () {
    let str = Array.prototype.slice.call(arguments).join(' ') + '\n'
    logStream.write(str)
  }

  tim = buildNode({
    pathPrefix: storagePath,
    networkName: 'testnet',
    identity: Identity.fromJSON(identity),
    keys: keys,
    syncInterval: 300000,
    afterBlockTimestamp: constants.afterBlockTimestamp
  })

  tim.watchTxs(manualTxs)
  tim.on('error', (err) => vorpal.log(err))
  tim.on('message', (info) => {
    if (!currentMode) {
      vorpal.log(`received ${info[TYPE]} with hash: ${info[CUR_HASH]}`)
      lookupAndLog(info)
    }
  })

  tim.on('unchained', (info) => {
    if (!currentMode) {
      vorpal.log(`detected transaction sealing ${info[TYPE]} with hash: ${info[CUR_HASH]}`)
      lookupAndLog(info)
    }
  })

  vorpal.localStorage('tradle-cli-' + identity.pubkeys[0].fingerprint)

  cb()
}

function setTransport (args, cb) {
  cb = cb || noop
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
      url: serverUrl,
      otrKey: DSA.parsePrivate(otrKey.priv)
    })
  } else if (args.type === 'http') {
    transport = new HttpClient()
    tim.ready().then(() => {
      transport.setRootHash(tim.myRootHash())
    })
  }

  transport.on('message', tim.receiveMsg)
  tim._send = transport.send.bind(transport)
  cb()
}

function show (args, cb) {
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
    .then(() => cb())
}

function canSend (cb) {
  let logger = this.log ? this : vorpal
  if (!tim) {
    logger.log('please run "setuser" first')
  } else if (!tim._send) {
    logger.log('please run "settransport" first')
  } else {
    return true
  }
}

function lookupAndLog (info) {
  tim.lookupObject(info)
    .then(obj => vorpal.log(prettify(obj.parsed.data)))
}

function setAlias (alias, identifier) {
  let aliases = vorpal.localStorage.getItem('aliases') || '{}'
  aliases = JSON.parse(aliases)
  aliases[alias] = identifier
  vorpal.localStorage.setItem('aliases', JSON.stringify(aliases))
}

function getAlias (alias) {
  return getAliases()[alias]
}

function getAliases () {
  let aliases = vorpal.localStorage.getItem('aliases') || '{}'
  return JSON.parse(aliases)
}
