
# tradle-cli

*This module is part of the [Tradle](http://github.com/tradle/tim) project*

Note: this is a work in progress and is rough around the edges. Bug reports, issues and pull requests are welcome!

## Installation

```bash
npm i -g @tradle/cli # you might need `sudo` depending on your setup
```

## Commands (copied & pasted from output of `help` command):

```bash
tradle$

  Commands:

    help [command...]                Provides help for a given command.
    exit [options]                   Exit Tradle command line client. Please run `stop` first
    setuser <handle>                 Set acting identity
    newuser <handle>                 Create a new identity
    ls-users                         List users
    settransport <type> <serverUrl>  Set transport: "ws" or "http"
    meet <identifier>                Introduce yourself to a stranger
    simplemsg <identifier>           Send a tradle.SimpleMessage to someone
    msg <identifier>                 Send a message to someone
    ls [options]                     List stored objects
    show-obj [options] <hash>        Print a stored object
    ls-txs                           List tracked txs
    show-tx <txId>                   Show information stored about transaction
    watchTx <hash>                   Watch a blockchain transaction
    watchAddr <address>              Watch a blockchain address
    forget <identifier>              Forget someone (wipe all history with them)
    stop                             Call this before exiting to give things a chance to clean up nicely
    whoami                           Print your identity
    alias <alias> <identifier>       Create an alias for a contact
    aliases                          list aliases
    chat <identifier>                Enter chat mode
    balance                          Check balance
    whereami                         Get the path to your Tradle user directory
```

## Usage

Sample session:

```bash
###################################################################################################################
#                                                                                                                 #
#                                             Welcome to Tradle!                                                  #
#                                                                                                                 #
###################################################################################################################

tradle$ ls-users
# no users found
tradle$ newuser klekl
# Generating a really good klekl. This may take a few seconds...
# Generated new user "klekl" in /Users/tenaciousmv/.tradle/klekl
tradle$ ls-users
# klekl
tradle$ setuser klekl
# Initializing Tradle client...
# detected transaction sealing tradle.Identity with hash: 3b31cbee623a1795fd6ecb6fe650cc2d874be958
# detected transaction sealing tradle.Identity with hash: 179d536d4fc033b0e074be8d756413302ea62805
# detected transaction sealing tradle.Identity with hash: d0b3f6780215cb8adfb9524810599b4f1f6444ae
# detected transaction sealing tradle.Identity with hash: 19b1bf07e11b921b0334e711caae9eedf6748af2
tradle$ settransport ws http://137.117.106.253:44444/easy/ws
tradle$ alias easy 179d536d4fc033b0e074be8d756413302ea62805
tradle$ meet easy
# ? About to send
# {
#   "_i": "7b20199d134d64c7ccc1036f6fb5a86a770812df:7b20199d134d64c7ccc1036f6fb5a86a770812df",
#   "_s": "304402200c12341ab97a7b2ebb847143494a2e7df4c230c01b8f380cb3529987746ea92002200c03ea27930558bb717cdb3135bffa63b84547be17878f4a7a410a9be1ec5526",
#   "_t": "tradle.IdentityPublishRequest",
#   "_z": "sGuG6xN+52rr/zR9yUeWljOCBDMIr0BvjqlYiDEYkVQ=",
#   "identity": {
#     "_t": "tradle.Identity",
#     "_z": "OotwnBoxXmTgggmjSyivCqFYzIqgxe3d67VPzkR8/M8=",
#     "pubkeys": [
#       {
#         "fingerprint": "mh8CWf8gVihZoLV5Zjz3jK1ZuFkXrAxpHp",
#         "networkName": "testnet",
#         "purpose": "payment",
#         "type": "bitcoin",
#         "value": "033b22339f8e7d1afd3a4bc16105ead993cd01cc79b24329fe4f9a27ca2fd639fd"
#       },
#       {
#         "fingerprint": "mib4GNa4DpTzqLbNaHxZQeZVaURuBMeist",
#         "networkName": "testnet",
#         "purpose": "messaging",
#         "type": "bitcoin",
#         "value": "033a490f36b05b002f7b8a9e54926eaaef6cf32f5621a2069db0f456ba2f921e43"
#       },
#       {
#         "curve": "ed25519",
#         "fingerprint": "5ec1b824dcff6b1c69e151f62b623185960c05f9beb62314af534edee364e8bf",
#         "purpose": "sign",
#         "type": "ec",
#         "value": "0312acd10e69f937805b7381a6e3a027663f881c637dc4698a2fb59405acac3e7c"
#       },
#       {
#         "curve": "ed25519",
#         "fingerprint": "23cb4f885b62ad6bf58cc0d563146cf3787b92b96290a6998ba0ee8a9edfec99",
#         "purpose": "update",
#         "type": "ec",
#         "value": "0343f5decb51ea9e12266268afd33dfef4cf0c4c76d0a4cbc26c21439bd42dffd5"
#       },
#       {
#         "fingerprint": "eafa1321de2a2b225199f5f5deb7a5f8b79fa955",
#         "purpose": "sign",
#         "type": "dsa",
#         "value": "AAAAAACAlHrYJM1KrjhFZCu3jKHRIx2Jq/AXa8yED56TsqW/yH+G1ZODYUxNarU88PGt2AczmRitj4k4cmDem4fgOpwShya4NjFsJY571A9sacMb0kGZLUY6wXakSQa+ioEDArBeHwjV+7ky3rNcOaaSo7Fi0gGrGZzixPL7t5RiqD0Qw78AAAAUp1W/6tXsuBLh9RyVsT03CN/KqCUAAACAhE3WqRtPDClCS5i5V5F1LoQE0oHVLYOjyh2c8J3xYIgqUHt+Bwg9MEYzyos7yB3Mvju0Hj2VuQ3rh8ysf5be3U+MStk0KaHjFwRw4ckQM/Nse8+LbCiRsm38iwldaPqoeIlu22iy1bjG6cMKt7DZ/Z/FFw++UVQRCWzJM0nNzEMAAACAY4T5u0ovWG+52hsGyZ1b5nhFIaK/TuL3QHkpcszcMy2rMDU3Oe40QbxNKIIEA9FZUUnhV+RDabf5whzUKzojIvynY9UBgCRQj4CDDKF06lU/1F6c2XlxzkL28fK7pdrFYY1Yt4rBHFO1crQdJrVnVbNsAF7egEet3BSY6rNPFAQ="
#       }BLh9RyVsT03CN/KqCUAAACAhE3WqRtPDClCS5i5V5F1LoQE0oHVLYOjyh2c8J3xYIgqUHt+Bwg9MEYzyos7yB3Mvju0Hj2VuQ3rh8ysf5be3U+MStk0KaHjFwRw4ckQM/Nse8+LbCiRsm38iwldaPqoeIlu22iy1bjG6cMKt7DZ/Z/FFw++UVQRCWzJM0nNzEMAAA    ],u0ovWG+52hsGyZ1b5nhFIaK/TuL3QHkpcszcMy2rMDU3Oe40QbxNKIIEA9FZUUnhV+RDabf5whzUKzojIvynY9UBgCRQj4CDDKF06lU/1F6c2XlxzkL28fK7pdrFYY1Yt4rBHFO1crQdJrVnVbNsAF7egEet3BSY6rNPFAQ="
#     "v": "0.3"
#   }
# }
#
# Is this OK? (yes)
# message queued
# delivered tradle.IdentityPublishRequest with hash 36350edef5fd2e9568e8f9467110e6b3163b6761
# received tradle.IdentityPublished with hash: db45e35e7b1436eb0bc67cfdb2844d802b2ffa6d
# {
#   "_i": "179d536d4fc033b0e074be8d756413302ea62805:179d536d4fc033b0e074be8d756413302ea62805",
#   "_s": "304402207e98d895631a4bbf636e9cca9e8dc0f4ed92c0759856607fd2dc1757db354e1302206e7768448d6c4c902ad5f11d6a1e49ea109bba09646fbf74cd9acb1afa2568f8",
#   "_t": "tradle.IdentityPublished",
#   "_z": "RodBAx16JOpLBkBFAB2zshRpt5wx7b0za53CBCvphJA=",
#   "identity": "7b20199d134d64c7ccc1036f6fb5a86a770812df",
#   "time": 1455572941418
# }
# received tradle.ProductList with hash: 8d5d64d0676a4e7ce3154877af40666a6ba240a8
# {...}
tradle$ chat easy
tradle$ chat easy: how goes, Easy Bank?
# them: Switching to representative mode is not yet implemented.
tradle$ chat easy: ok, let me know when it is
# them: Switching to representative mode is not yet implemented.
```
