
const typeforce = require('typeforce')
const extend = require('xtend')
const Identity = require('@tradle/identity').Identity
const kiki = require('@tradle/kiki')
const constants = require('@tradle/constants')
const Builder = require('@tradle/chained-obj').Builder
const NONCE = constants.NONCE
const ROOT_HASH = constants.ROOT_HASH
const CUR_HASH = constants.CUR_HASH
const tradleUtils = require('@tradle/utils')
const KEYS = [
  {
    type: 'bitcoin',
    purpose: 'payment'
  },
  {
    type: 'bitcoin',
    purpose: 'messaging'
  },
  {
    type: 'ec',
    purpose: 'sign'
  },
  {
    type: 'ec',
    purpose: 'update'
  },
  {
    type: 'dsa',
    purpose: 'sign'
  }
]

module.exports = function genUser (opts, cb) {
  typeforce({
    networkName: 'String',
  }, opts)

  var networkName = opts.networkName
  var identity = new Identity()
    .set(NONCE, tradleUtils.newMsgNonce())

  var keys = KEYS.map(function (k) {
    k = extend(k)
    if (k.type === 'bitcoin') {
      k.networkName = networkName
    }

    return kiki.toKey(k, true)
  })

  keys.forEach(identity.addKey, identity)

  var info = {
    pub: identity.toJSON(),
    priv: keys.map(function (k) {
      return k.exportPrivate()
    })
  }

  new Builder()
    .data(info.pub)
    .build()
    .then(buf => {
      tradleUtils.getStorageKeyFor(buf, function (err, hash) {
        if (err) return cb(err)

        info[ROOT_HASH] = info[CUR_HASH] = hash
        cb(null, info)
      })
    })
}
