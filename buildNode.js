
var crypto = require('crypto')
var extend = require('xtend')
var typeforce = require('typeforce')
var leveldown = require('leveldown')
var levelup = require('levelup')
var Blockchain = require('@tradle/cb-blockr')
var Driver = require('tim')
var Keeper = require('@tradle/http-keeper')

module.exports = function buildNode (options) {
  typeforce({
    identity: 'Object',
    keys: 'Array',
    networkName: 'String'
  }, options)

  options = extend(options)
  var identityJSON = options.identity.toJSON()
  if (!options.pathPrefix) {
    options.pathPrefix = getPrefix(identityJSON)
  }

  var db = options.leveldown || leveldown
  if (!options.keeper) {
    options.keeper = new Keeper({
      storeOnFetch: true,
      db: levelup(options.pathPrefix + '-keeper', { db: db, valueEncoding: 'binary' }),
      fallbacks: ['http://tradle.io:25667']
    })
  }

  if (!options.networkName) {
    options.networkName = 'testnet'
  }

  if (!options.blockchain) {
    options.blockchain = new Blockchain(options.networkName)
  }

  var d = new Driver(extend({
    leveldown: db,
    syncInterval: 60000
  }, options))

  d._send = options._send
  if (!d._send) {
    var m = options.messenger
    if (m) {
      d._send = m.send.bind(m)
      m.on('message', d.receiveMsg)
    }
  }

  return d
}

function findKey (keys, where) {
  var match
  keys.some(function (k) {
    for (var p in where) {
      if (k[p] !== where[p]) return false
    }

    match = k
    return true
  })

  return match
}

function getPrefix (identity) {
  return identity.name
    ? identity.name.firstName.toLowerCase()
    : identity.pubkeys[0].fingerprint
}
