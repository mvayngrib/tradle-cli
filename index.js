'use strict'

const fs = require('fs')
const path = require('path')
// const spawn = require('child_process').spawn
const find = require('array-find')
const Q = require('bluebird-q')
const bs58check = require('bs58check')
const vorpal = require('vorpal')()
const chalk = vorpal.chalk
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
const cliUtils = require('@tradle/cli-utils')
const genUser = cliUtils.genUser
const prettify = cliUtils.toJSONForConsole
const DEV = true//process.env.NODE_ENV === 'development'
const NETWORK_NAME = 'testnet'
const noop = () => {}

Debug.log = noop // initially

module.exports = {
  cli: vorpal,
  // getUserIdentityPath: getIdentityPath,
  // genUser,
  // getUserIdentity,
  // prettify,
  // getLogger,
  // logErr
}

let selfDestructing
let cleanup = (err) => {
  if (err && typeof err === 'object') {
    logErr(err)
  }

  if (selfDestructing) return

  selfDestructing = true
  debug('cleaning up before shut down...')
  if (state.tim) {
    state.tim.destroy()
      .then(() => process.exit(0))
      .catch(err => process.exit(1))
  } else {
    process.exit(0)
  }
}

process.on('uncaughtException', err => {
  debug(err.message, err.stack)
})

// process.on('uncaughtException', cleanup)
// process.on('exit', cleanup)
// process.on('SIGINT', cleanup)
// process.on('SIGTERM', cleanup)

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

let state = {}

const showCli = vorpal.show
vorpal.show = function () {
  console.log(BANNER)
  setTimeout(() => vorpal.exec('help'), 100)
  return showCli.apply(vorpal, arguments)
}

vorpal
  .delimiter('tradle$')
  .history('tradle-cli')
  // .use(repl)
  .on('exitmode', function () {
    state.currentMode = null
  })

vorpal
  .command('setuser <handle>', 'Set acting identity')
  .action(setUser)

vorpal
  .command('newuser <handle>', 'Create a new identity')
  .action(function (args, cb) {
    let handle = args.handle
    if (!/^[a-zA-Z0-9_-]+$/.test(handle)) {
      this.log('Alpanumeric characters, underscores and dashes only please')
      return cb()
    }

    this.log(`Generating a really good ${handle}. This may take a few seconds...`)

    let userPath = getUserPath(handle)
    Q.nfcall(genUser, {
      networkName: NETWORK_NAME
    })
    .then((user) => {
      mkdirp.sync(userPath)
      mkdirp.sync(getLogsPath(handle))
      return Q.all([
        Q.ninvoke(fs, 'writeFile', getIdentityPath(handle), prettify(user.pub)),
        Q.ninvoke(fs, 'writeFile', getKeysPath(handle), prettify(user.priv)),
        Q.ninvoke(fs, 'writeFile', getPreferencesPath(handle), prettify(newPreferences()))
      ])
    })
    .then(() => this.log(`Generated new user "${handle}" in ${userPath}`))
    .catch(err => logErr.call(this, err))
    .then(() => cb())
  })

vorpal
  .command('ls-users', 'List users')
  .action(function (args, cb) {
    try {
      let handles = fs.readdirSync(getBasePath())
      handles.forEach(handle => this.log(handle))
    } catch (err) {
      this.log('no users found')
    }

    cb()
  })

vorpal
  .command('settransport <type> <serverUrl>', 'Set transport: "ws" or "http"')
  .action(setTransport)

vorpal
  .command('meet <identifier>', 'Introduce yourself to a stranger')
  .help(IDENTIFIER_EXPLANATION)
  .action(function (args, cb) {
    if (!canSend.call(this)) return cb()

    let opts = { deliver: true, public: true }

    findRecipient(args.identifier)
    .then((recipient) => {
      opts.to = toCoords(recipient)
      opts.msg = {
        [TYPE]: 'tradle.IdentityPublishRequest',
        identity: state.identity
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
    .catch(err => logErr.call(this, err))
    .then(() => cb())
  })

vorpal
  .command('simplemsg <identifier>', 'Send a tradle.SimpleMessage to someone')
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
    .catch(err => logErr.call(this, err))
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
      .catch(err => logErr.call(this, err))
      .then(() => cb())
  })
  // .cancel(function () {
  //   this.log('message canceled');
  // })

vorpal
  .command('ls', 'List stored objects')
  .option('-t, --type', 'Limit objects by type, e.g. tradle.Identity')
  .action(function (args, cb) {
    if (!state.tim) {
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

    state.tim.messages().createValueStream()
      .on('data', data => {
        if (!types || types.includes(data[TYPE])) {
          results.push(data)
        }
      })
      .on('error', (e) => {
        err = e
        logErr.call(this, err)
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

          this.log('Tip: use `show-obj -v <hash>` to get full metadata')
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
  .command('show-obj <hash>', 'Print a stored object')
  .option('-v, --verbose', 'Print all metadata as well.')
  .action(show)

// vorpal
//   .command('debug <namespaces>', 'Enable debug namespaces')
//   .action(function (args, cb) {
//     Debug.enable(args.namespaces)
//     cb()
//   })

vorpal
  .command('ls-txs', 'List tracked txs')
  .action(function (args, cb) {
    if (!checkLoggedIn()) return cb()

    state.tim.transactions().createKeyStream()
      .on('data', txId => this.log(txId))
      .on('end', cb)
      .on('error', err => {
        this.log(err)
        cb()
      })
  })

vorpal
  .command('show-tx <txId>', 'Show information stored about transaction')
  .action(function (args, cb) {
    if (!checkLoggedIn()) return cb()

    state.tim.transactions().get(args.txId, (err, tx) => {
      if (tx) {
        for (let p in tx) {
          if (Buffer.isBuffer(tx[p])) {
            tx[p] = tx[p].toString('hex')
          }
        }
      }

      this.log(err || tx)
      cb()
    })
  })

vorpal
  .command('watchTx <hash>', 'Watch a blockchain transaction')
  .action(function (args, cb) {
    if (!state.tim) {
      this.log('please run "setuser" first')
      return cb()
    }

    try {
      let buf = new Buffer(args.hash, 'hex')
      if (buf.length !== 32) {
        throw new Error('invalid tx hash')
      }
    } catch (err) {
      logErr.call(this, err)
      return cb()
    }

    state.tim.watchTxs(args.hash)
    state.tim.sync()
    cb()
  })

vorpal
  .command('watchAddr <address>', 'Watch a blockchain address')
  .action(function (args, cb) {
    if (!state.tim) {
      this.log('please run "setuser" first')
      return cb()
    }

    try {
      bs58check.decode(args.address)
    } catch (err) {
      logErr.call(this, err)
      return cb()
    }

    state.tim.watchAddresses(args.address)
    state.tim.sync()
    cb()
  })

vorpal
  .command('forget <identifier>', 'Forget someone (wipe all history with them)')
  .help(IDENTIFIER_EXPLANATION)
  .action(function (args, cb) {
    if (!state.tim) {
      this.log('please run "setuser" first')
      return cb()
    }

    findRecipient(args.identifier)
      .then(r => state.tim.forget(r[ROOT_HASH]))
      .then(() => this.log('forgot ' + args.identifier))
      .catch(err => logErr.call(this, err))
      .then(() => cb())
  })

vorpal
  .command('stop', 'Call this before exiting to give things a chance to clean up nicely')
  .action(function (args, cb) {
    if (!state.tim) return cb()

    tim
      .destroy()
      .catch(err => logErr.call(this, err))
      .then(() => cb())
  })

vorpal
  .command('whoami', 'Print your identity')
  .action(function (args, cb) {
    if (!state.tim) {
      this.log('You\'re absolutely wonderful! But you probably want to run "setuser"')
      return cb()
    }

    // return show.call(this, { hash: tim.myCurrentHash() }, cb)
    // tim.lookupObjectByCurHash(tim.myCurrentHash())
    //   .then((obj) => this.log(obj))
    this.log('Current hash: ' + state.tim.myCurrentHash())
    this.log('Root hash: ' + state.tim.myRootHash())
    printIdentityPublishStatus(state.tim)
      .then(() => {
        this.log(prettify(state.tim.identityJSON))
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
    if (!state.tim) {
      this.log('please run "setuser" first')
      return cb()
    }

    findRecipient(args.identifier)
      .then(() => setAlias(args.alias, args.identifier))
      .catch(err => logErr.call(this, err))
      .then(() => cb())
  })

vorpal
  .command('aliases', 'list aliases')
  .action(function (args, cb) {
    if (!checkLoggedIn()) return cb()

    this.log(prettify(state.preferences.aliases))
    cb()
  })

let chattingWith // hack, need to figure out how to save state in mode
vorpal
  .mode('chat <identifier>', 'Enter chat mode')
  .init(function (args, cb) {
    if (!canSend.call(this)) {
      cb(new Error('no user set'))
      return vorpal.exec('exit')
    }

    state.currentMode = 'chat'

    let id = args.identifier
    findRecipient(id)
      .then(recipient => {
        chattingWith = toCoords(recipient)
      })
      .catch(err => logErr.call(this, err))
      .then(() => cb())

    let onMessage = (info) => {
      if (info[TYPE] === 'tradle.SimpleMessage') {
        state.tim.lookupObject(info)
          .then(obj => this.log('them: ' + obj.parsed.data.message))
      }
    }

    state.tim.on('message', onMessage)
    vorpal.once('exitmode', () => state.tim.removeListener('message', onMessage))
  })
  .action(function (msg, cb) {
    buildMsg({
      [TYPE]: 'tradle.SimpleMessage',
      message: msg
    })
    .then(buf => state.tim.sign(buf))
    .then(signed => {
      return state.tim.send({
        msg: signed,
        to: chattingWith,
        deliver: true
      })
    })
    .catch(err => logErr.call(this, err))
    .then(() => cb())
  })

vorpal
  .command('balance', 'Check balance')
  .action(function (args, cb) {
    if (!checkLoggedIn.call(this)) return cb()

    state.tim.wallet.balance((err, balance) => {
      if (err) {
        this.log('Failed to check balance: ' + err.message)
        return cb()
      }

      this.log('Address: ' + state.tim.wallet.addressString)
      this.log('Balance: ' + balance + ' satoshis')
      cb()
    })
  })

vorpal
  .command('whereami', 'Get the path to your Tradle user directory')
  .action(function (args, cb) {
    if (!checkLoggedIn.call(this)) return cb()

    this.log(getUserPath(state.handle))
    cb()
  })

vorpal
  .catch('[command]', 'Look up object')
  .action(function (args, cb) {
    let command = args.command
    if (!state.tim) {
      this.log(`Command "${command}" not found.`)
      return cb()
    }

    this.log(`Command "${command}" not found. Looking up object with hash "${command}"`)
    return show.call(this, {
      hash: command,
      options: {}
    }, cb)
  })

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

function findRecipient (identifier) {
  identifier = getAlias(identifier) || identifier
  return Q.allSettled([
    state.tim.lookupIdentity({ fingerprint: identifier }),
    state.tim.lookupIdentity({ [ROOT_HASH]: identifier })
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

    return state.tim.sign(msg)
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

// function runDefault () {
//   setUser.call(vorpal, {
//     pathToIdentity: './test/fixtures/bill-pub',
//     pathToKeys: './test/fixtures/bill-priv',
//     options: {
//       dir: path.join(DEFAULT_STORAGE_PATH, 'bill')
//     }
//   })

//   setTransport.call(vorpal, {
//     type: 'ws',
//     serverUrl: 'http://127.0.0.1:44444/ws/easy'
//   })
// }

function debug () {
  let logger = vorpal || console
  return logger.log.apply(logger, arguments)
}

function sendMsg (opts) {
  let msg = opts.msg
  return maybeSign.call(this, msg)
    .then(previewSend.bind(this))
    .then(buildMsg)
    .then((buf) => {
      opts.msg = buf
      return state.tim.send(opts)
    })
    .then((entries) => {
      this.log('message queued')
      let rh = entries[0].get(ROOT_HASH)
      let sentHandler = (info) => {
        if (info[ROOT_HASH] === rh) {
          this.log(`delivered ${info[TYPE]} with hash ${rh}`)
          state.tim.removeListener('sent', sentHandler)
        }
      }

      state.tim.on('sent', sentHandler)
    })
}

function getUserIdentity (handle) {
  return require(getIdentityPath(handle))
}

function getUserInfo (handle) {
  const userPath = getUserPath(handle)
  const iPath = getIdentityPath(handle)
  const kPath = getKeysPath(handle)
  const pPath = getPreferencesPath(handle)
  const userInfo = {
    identity: require(iPath),
    keys: require(kPath)
  }

  try {
    userInfo.preferences = require(pPath)
  } catch (err) {
    if (this.log) this.log('Preferences not found')
    userInfo.preferences = newPreferences()
  }

  return userInfo
}

function setUser (args, cb) {
  cb = cb || noop
  let logger = getLogger(this)
  if (state.tim) {
    logger.log(`Terminating ${state.handle}'s session...`)
    return state.tim.destroy()
      .then(() => {
        state.tim = null
        setUser(args, cb)
      })
  }

  let handle = args.handle
  let userInfo
  try {
    userInfo = getUserInfo(handle)
  } catch (err) {
    this.log('User not found')
    return cb()
  }

  for (let p in userInfo) {
    state[p] = userInfo[p]
  }

  state.handle = handle
  const userPath = getUserPath(handle)
  const logsPath = getLogsPath(handle)
  const logPath = path.join(logsPath, 'debug-' + Date.now() + '.log')
  const logStream = fs.createWriteStream(logPath, {'flags': 'a'})

  Debug.enable()
  Debug.log = function () {
    const str = Array.prototype.slice.call(arguments).join(' ') + '\n'
    logStream.write(str)
  }

  state.tim = buildNode({
    pathPrefix: path.resolve(userPath, 'tim'),
    networkName: NETWORK_NAME,
    identity: Identity.fromJSON(state.identity),
    keys: state.keys,
    syncInterval: 300000,
    afterBlockTimestamp: constants.afterBlockTimestamp
  })

  state.tim.watchTxs(manualTxs)
  state.tim.on('error', (err) => vorpal.log(err))
  state.tim.on('message', (info) => {
    if (!state.currentMode) {
      vorpal.log(`received ${info[TYPE]} with hash: ${info[CUR_HASH]}`)
      lookupAndLog(info)
    }
  })

  state.tim.on('unchained', (info) => {
    if (!state.currentMode) {
      vorpal.log(`detected tx ${info.txId} sealing ${info[TYPE]} with hash ${info[CUR_HASH]}`)
      // lookupAndLog(info)
    }
  })

  if (state.preferences.transport) {
    setTransport(state.preferences.transport, noop)
  }

  // vorpal.localStorage('tradle-cli-' + identity.pubkeys[0].fingerprint)
  logger.log(`Initializing Tradle client...`)
  cb()
}

function setTransport (args, cb) {
  cb = cb || noop
  if (!state.tim) {
    this.log('please run "setuser" first')
    return cb()
  }

  let serverUrl = args.serverUrl
  let transport
  if (args.type === 'ws') {
    let otrKey = find(state.keys, (k) => {
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
    state.tim.ready().then(() => {
      transport.setRootHash(state.tim.myRootHash())
    })
  }

  transport.on('message', state.tim.receiveMsg)
  state.tim._send = transport.send.bind(transport)
  state.preferences.transport = args
  savePreferences()
  cb()
}

function show (args, cb) {
  let logger = getLogger(this)
  if (!state.tim) {
    this.log('please run "setuser" first')
    return cb()
  }

  let hash = args.hash
  state.tim.lookupObjectByCurHash(hash)
    .then(obj => {
      obj = args.options.verbose ? obj : obj.parsed.data
      this.log(prettify(obj))
    })
    .catch(err => logErr.call(this, err))
    .then(() => cb())
}

function checkLoggedIn () {
  let logger = getLogger(this)
  if (!state.tim) {
    logger.log('please run "setuser" first')
  } else {
    return true
  }
}

function canSend () {
  if (!checkLoggedIn()) return

  let logger = this && this.log ? this : vorpal
  if (!state.tim._send) {
    logger.log('please run "settransport" first')
  } else {
    return true
  }
}

function lookupAndLog (info) {
  state.tim.lookupObject(info)
    .then(obj => vorpal.log(prettify(obj.parsed.data)))
}

function setAlias (alias, identifier) {
  state.preferences.aliases[alias] = identifier
  savePreferences()
}

function savePreferences () {
  fs.writeFile(getPreferencesPath(state.handle), prettify(state.preferences), (err) => {
    if (!err) return

    vorpal.log('failed to safe preferences:')
    vorpal.log(err)
  })
}

function getAlias (alias) {
  return state.preferences.aliases[alias]
}

function getUserPath (handle) {
  return path.resolve(getBasePath(), handle)
}

function getLogsPath (handle) {
  return path.resolve(getUserPath(handle), 'logs')
}

function getIdentityPath (handle) {
  return path.resolve(getUserPath(handle), 'pub.json')
}

function getKeysPath (handle) {
  return path.resolve(getUserPath(handle), 'keys.json')
}

function getBasePath () {
  return path.resolve(process.env.HOME, '.tradle')
}

function getPreferencesPath (handle) {
  return path.resolve(getUserPath(handle), 'preferences.json')
}

function logErr (err) {
  let logger = getLogger(this)
  logger.log(err)
  if (DEV) logger.log(err.stack)
}

function getLogger (obj) {
  return obj && obj.log ? obj : vorpal || console
}

function newPreferences () {
  return {
    aliases: {}
  }
}
