
# tradle-cli

Command line client for Tradle

*This module is part of the [Tradle](http://github.com/tradle/tim) project*

Note: this is a work in progress and is rough around the edges. Bug reports, issues and pull requests are welcome!

## Installation

Note: the below installations currently use private docker images and npm modules, so send an email to mark@tradle.io if you need access.

#### Dockerized

Create a data volume container (first time only): 

```bash
docker create -v /tdata --name tradle-cli-data cogniteev/echo
```

Run the tradle-cli container:

```bash
docker run -it --rm --name tradle-cli -e "HOME=/tdata" --volumes-from tradle-cli-data tradle/cli:dev
```

#### Directly on host

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

## Logs

Logs are stored per user. Use the `whereami` command to get the user directory, and logs will be under it.

## Usage

Sample session:

```bash
###################################################################################################################
#                                                                                                                 #
#                                             Welcome to Tradle!                                                  #
#                                                                                                                 #
###################################################################################################################

tradle$

  # Commands:

  #   help [command...]                Provides help for a given command.
  #   exit [options]                   Exit Tradle command line client. Please run `stop` first
  #   setuser <handle>                 Set acting identity
  #   newuser <handle>                 Create a new identity
  #   ls-users                         List users
  #   settransport <type> <serverUrl>  Set transport: "ws" or "http"
  #   meet <identifier>                Introduce yourself to a stranger
  #   simplemsg <identifier>           Send a tradle.SimpleMessage to someone
  #   msg <identifier>                 Send a message to someone
  #   ls [options]                     List stored objects
  #   show-obj [options] <hash>        Print a stored object
  #   ls-txs                           List tracked txs
  #   show-tx <txId>                   Show information stored about transaction
  #   watchTx <hash>                   Watch a blockchain transaction
  #   watchAddr <address>              Watch a blockchain address
  #   forget <identifier>              Forget someone (wipe all history with them)
  #   stop                             Call this before exiting to give things a chance to clean up nicely
  #   whoami                           Print your identity
  #   alias <alias> <identifier>       Create an alias for a contact
  #   aliases                          list aliases
  #   chat <identifier>                Enter chat mode
  #   balance                          Check balance
  #   whereami                         Get the path to your Tradle user directory


tradle$ newuser klekl
# Generating a really good klekl. This may take a few seconds...
# Generated new user "klekl" in /Users/tenaciousmv/.tradle/klekl
tradle$ setuser klekl
# Initializing Tradle client...
# detected transaction sealing tradle.Identity with hash: 3b31cbee623a1795fd6ecb6fe650cc2d874be958
# detected transaction sealing tradle.Identity with hash: 179d536d4fc033b0e074be8d756413302ea62805
# detected transaction sealing tradle.Identity with hash: d0b3f6780215cb8adfb9524810599b4f1f6444ae
# detected transaction sealing tradle.Identity with hash: 19b1bf07e11b921b0334e711caae9eedf6748af2
tradle$ settransport ws http://137.117.106.253:44444/easy/ws # Tradle server in Azure
tradle$ show-obj 179d536d4fc033b0e074be8d756413302ea62805 # Easy Bank bot
# {
#   "_t": "tradle.Identity",
#   "_z": "e2d96b20ea90b884bf38fdefb2077f978a58ef9c9717c87613ef585578ddf2f4",
#   "name": {
#     "firstName": "Carol",
#     "formatted": "Carol"
#   },
#   "organization": {
#     "id": "tradle.Organization_71e4b7cd6c11ab7221537275988f113a879029eb_71e4b7cd6c11ab7221537275988f113a879029eb",
#     "title": "Easy Bank"
#   },
#   "pubkeys": [
#     {
#       "fingerprint": "mzi68q2ZyAPMyQ2TqQiBxb1WJpsQtVyM5s",
#       "networkName": "testnet",
#       "purpose": "payment",
#       "type": "bitcoin",
#       "value": "037cf6b4f5cbd5d39017514fa28b02623434c5ccbfd503aeb0c452b08d52c2f4de"
#     },
#     {
#       "fingerprint": "mt1Zhh5P9HExGxJ1NGJ2MNt92gEd4FwpWu",
#       "networkName": "testnet",
#       "purpose": "messaging",
#       "type": "bitcoin",
#       "value": "03803cb6c29def382da2a6d47a35c40bf66445aba832997c3511f5ccd79af3dabc"
#     },
#     {
#       "curve": "secp256k1",
#       "fingerprint": "5c5608e9056d699f93eccce3d7f11a6960512165820d3ea82882f569df2d6ff1",
#       "purpose": "sign",
#       "type": "ec",
#       "value": "0299c9f118a3fa32f18b31ad5177a5fc4c8e1185f5dcaee5a0473ff574d67d77c1"
#     },
#     {
#       "curve": "secp256k1",
#       "fingerprint": "9963c5a3110040ff5dae870cd976482adfb1a76b6d0ef1a7b57b5015cef6ec64",
#       "purpose": "update",
#       "type": "ec",
#       "value": "0258a169b3ef82742eb06752f49b8f07a1660ec84bb60e46bb0adc8cb58b22d59b"
#     },
#     {
#       "fingerprint": "212fcd4f520cf968295512ab15d99fdf7f61026d",
#       "purpose": "sign",
#       "type": "dsa",
#       "value": "AAAAAACA5acPXhaPgrrMRI5PzgWMD7oGhNUD9t1CvZ9S9VtbzUfBfKBFyngl7gLPCI0MtOWOCbIFXO+SKWSbRMgY3hjLAH7V+A/jeskKTqGLVSK4hZ9hqg3YcknWvn4f/s18a3b0CT1AUYFmKBCwbXhEgH27leP9mOpiTxFpXYS0JwBA0uUAAAAUuXExZHKZpRq5lqEEJkh/Nv25+q0AAACAEXFYY1xZ0MUv3wWCMW8ituhEXBIS4Jdm32+XqJOHp/V06Zcx7w0deLEVLhxl5u2ZaYXFyZtgt5EhPfFvz3UoAKTKci27uMDj0/7zbKqRvTAPURHaewIFFdQOs+4Nd6fGMmAaT/xwNB40zQGjmJYs/jP1KD2hI85DcgOigtwrznsAAACAoC1ZtnnOcLFbydlQw+Kr8PdYUl9c6W5Kn0gDL2Oda7NxzeDwW/PxWxG6HwaKgt9fEuYBJS0VwP4F0cylD/Ot/eUPEwS+tr+Y/enxnIoFOq65+HWOV2kNc83Jru3zoOlgmfds1g0YcOPadqpW7qYms4oHbZw+WkVaWauRKlzxWtA="
#     }
#   ],
#   "v": "0.3"
tradle$ alias easy 179d536d4fc033b0e074be8d756413302ea62805
tradle$ meet easy
? About to send
# {
#   "_i": "09bf4d8fe6228ab8d52b26ffdb967de28048d4c8:09bf4d8fe6228ab8d52b26ffdb967de28048d4c8",
#   "_s": "304402200bb5016236a8c0680110cb75fa30e021453f596394aa67f86ecb1c8815065ded02200d2d219cd8ea3882594b5ee6684919fd947fd7f0c3411fca063c4c4424a05a8b",
#   "_t": "tradle.IdentityPublishRequest",
#   "_z": "/I2FoHmLtg9kK+uzLLdQ88JyWExEAdgCtgD/CmdfBK0=",
#   "identity": {
#     "_t": "tradle.Identity",
#     "_z": "PtYlNk6OMDJg6X7+Mf2ZeYAGei6ie6kC2ktReWLs3OA=",
#     "pubkeys": [
#       {
#         "fingerprint": "mgquwJZjBhBZpuVEhiDjpWctctPmc3FPfw",
#         "networkName": "testnet",
#         "purpose": "payment",
#         "type": "bitcoin",
#         "value": "02a588d6fe8cc31cd8a828b933a811e5e24b0c3c102e36cd8f5af8fd8a28c9cc1b"
#       },
#       {
#         "fingerprint": "mwFGA1FPy5ii7sarDe42kmdxTGKhJmPYBy",
#         "networkName": "testnet",
#         "purpose": "messaging",
#         "type": "bitcoin",
#         "value": "0311dd73f130a2be9bad0b5de6111b5c44be4e42e12823cef16dfb606b66087d82"
#       },
#       {
#         "curve": "ed25519",
#         "fingerprint": "002f96b9933f0cf7d22a706100cc312e63604ae67f3be3597e9456debc46c91b",
#         "purpose": "sign",
#         "type": "ec",
#         "value": "02136d06f0caa108e964d3c0b5b02550588c363f8f8bd7081b7837dce55d8dc11c"
#       },
#       {
#         "curve": "ed25519",
#         "fingerprint": "d05cc679bff922260182a7aaf63b6f9d70aa69697a24d50a44f71715a7377e3f",
#         "purpose": "update",
#         "type": "ec",
#         "value": "0333fd61ed48bc8c2c1cd2dbd535306ed129992276127c6ab31082d1f6e508b54f"
#       },
#       {
#         "fingerprint": "22817ea91ecaaa1fd01c75344468d58ee74e1a3f",
#         "purpose": "sign",
#         "type": "dsa",
#         "value": "AAAAAACA6tjxntJ7s/uP6PZXtya0nceti3sQJw7j9LGvc+Xogz/0ZgNJ1WNdFr5tu9RZDU8qkiwWK5znAnhJznrc471w4CSf/fqCadJv1HZAXg47BkKeNQtLqx787NoU5mWRLRvjFpbBnZiM2YZYCn2F26nkYdT5OOLKO0J5J5KZfUs/ALUAAAAUjsXdA5z1rVUV897dSMVLjn5ged8AAACA6DBIIdP0KW/9fphWRT3WHzrFfe40Ddw5qijkJIsWP9Jd9ggvG5QPe1Dc40RYJbgWkgwtwqXXxwkQnbdKhIETCH+pJ6QLKqJZV5v6NSRV0II4Zc4TV1eyi4LsjiEPZqjZjLQpS0Ls/6n7v96KmFq2SHadPJFxc4QZ6pmoawl5hcAAAACAIyiHN0LlC4aQNcBJv5apgULfPVDFNZ0ctinpMdwjcoTr26eQQk59biPPvSZ2jKtf4E1LfRgKkIcngJ3etyuqZf/bCrOb784xKZpzGNN1gyq+Jfu5nZ2kCxmdZ+GchCJyQ8FrPffhnvaOOve0oalNZIFvLP7kHvV0QRD74YVLXys="
#       }
#     ],rVUV897dSMVLjn5ged8AAACA6DBIIdP0KW/9fphWRT3WHzrFfe40Ddw5qijkJIsWP9Jd9ggvG5QPe1Dc40RYJbgWkgwtwqXXxwkQnbdKhIETCH+pJ6QLKqJZV5v6NSRV0II4Zc4TV1eyi4LsjiEPZqjZjLQpS0Ls/6n7v96KmFq2SHadPJFxc4QZ6pmoawl5hcAAAA    "v": "0.3"NcBJv5apgULfPVDFNZ0ctinpMdwjcoTr26eQQk59biPPvSZ2jKtf4E1LfRgKkIcngJ3etyuqZf/bCrOb784xKZpzGNN1gyq+Jfu5nZ2kCxmdZ+GchCJyQ8FrPffhnvaOOve0oalNZIFvLP7kHvV0QRD74YVLXys="
#   }
# }   ],N0LlC4aQNcBJv5apgULfPVDFNZ0ctinpMdwjcoTr26eQQk59biPPvSZ2jKtf4E1LfRgKkIcngJ3etyuqZf/bCrOb784xKZpzGNN1gyq+Jfu5nZ2kCxmdZ+GchCJyQ8FrPffhnvaOOve0oalNZIFvLP7kHvV0QRD74YVLXys="
? sign the message? (yes)  (Y/n)
Is this OK? (yes)  (Y/n)
# message queued
# delivered tradle.IdentityPublishRequest with hash 0ff8fce5a1d21950262b958bfec927bdfc0ee294
# received tradle.IdentityPublished with hash: 57db1262139787145e3c6161efa3472d2ed93cde
# {
#   "_i": "179d536d4fc033b0e074be8d756413302ea62805:179d536d4fc033b0e074be8d756413302ea62805",
#   "_s": "304502202d398854a8e8d62e1e1e96355a4d886282cb256353ee050332b37d735d36158e022100bd7d5bc917868186308e97f13b514196e7eeaeb0d7efec85fc6e59447e15f0fd",
#   "_t": "tradle.IdentityPublished",
#   "_z": "KJbcUX/YQZjXG6+PZI0hi55LLMgi3edWwX7m9qt21ss=",
#   "identity": "09bf4d8fe6228ab8d52b26ffdb967de28048d4c8",
#   "time": 1455593024234
# }
# received tradle.ProductList with hash: 7dff1b6628f20b386c244e5a46371eb62ea413f9
# {
#   "_i": "179d536d4fc033b0e074be8d756413302ea62805:179d536d4fc033b0e074be8d756413302ea62805",
#   "_s": "30450220361514b589cc37c6390bd661e399258abced777580530947b7f9551610339f9b022100cc267dd5b872d1eb202e6c7a8a52d9542222b1c568998a06015639372a9b0dbe",
#   "_t": "tradle.ProductList",
#   "_z": "XKxEEMSdCQUdebeOpr4oH9R6TtUX8N3+wZfme3fqrY8=",
#   "list": "[{\"id\":\"tradle.CurrentAccount\",\"type\":\"tradle.Model\",\"title\":\"Current Account\",\"interfaces\":[\"tradle.Message\"],\"subClassOf\":\"tradle.FinancialProduct\",\"forms\":[\"tradle.AboutYou\",\"tradle.YourMoney\",\"tradle.UtilityBillVerification\"],\"properties\":{\"_t\":{\"type\":\"string\",\"readOnly\":true},\"productType\":{\"type\":\"string\",\"readOnly\":true,\"displayName\":true},\"from\":{\"type\":\"object\",\"readOnly\":true,\"ref\":\"tradle.Identity\"},\"to\":{\"type\":\"object\",\"readOnly\":true,\"ref\":\"tradle.Identity\"},\"accountWith\":{\"type\":\"object\",\"readOnly\":true,\"displayName\":true,\"ref\":\"tradle.Organization\"},\"residentialStatus\":{\"type\":\"object\",\"ref\":\"tradle.ResidentialStatus\"},\"maritalStatus\":{\"type\":\"object\",\"ref\":\"tradle.MaritalStatus\"},\"dependants\":{\"type\":\"number\",\"description\":\"How many people who live with you depend on you financially?\"},\"nationality\":{\"type\":\"object\",\"ref\":\"tradle.Nationality\"},\"inUKFrom\":{\"type\":\"date\",\"description\":\"When did you arrive in the UK?\",\"title\":\"In UK from\"},\"countryOfBirth\":{\"type\":\"object\",\"ref\":\"tradle.Country\"},\"taxResidency\":{\"type\":\"object\",\"description\":\"Country/countries in which you have tax residency (or been resident of for the past 2 years):\",\"ref\":\"tradle.Country\"},\"fundAccount\":{\"type\":\"object\",\"description\":\"How will you fund your account?\",\"ref\":\"tradle.HowToFund\"},\"purposeOfTheAccount\":{\"type\":\"object\",\"ref\":\"tradle.PurposeOfTheAccount\"},\"phones\":{\"type\":\"array\",\"items\":{\"type\":\"string\",\"properties\":{\"phoneType\":{\"type\":\"string\",\"ref\":\"tradle.PhoneTypes\"},\"number\":{\"type\":\"string\",\"keyboard\":\"phone-pad\"}}},\"required\":[\"phoneType\",\"number\"]},\"emailAddress\":{\"type\":\"string\",\"keyboard\":\"email-address\"},\"employer\":{\"type\":\"object\",\"ref\":\"tradle.Organization\"},\"howLongHaveYouWorkedHere\":{\"type\":\"number\",\"units\":\"years\"},\"monthlyIncome\":{\"type\":\"object\",\"ref\":\"tradle.Money\"}}},{\"id\":\"tradle.BusinessAccount\",\"title\":\"Business Account\",\"interfaces\":[\"tradle.Message\"],\"type\":\"tradle.Model\",\"forms\":[\"tradle.BusinessInformation\",\"tradle.SalesData\"],\"subClassOf\":\"tradle.FinancialProduct\",\"properties\":{\"_t\":{\"type\":\"string\",\"readOnly\":true},\"from\":{\"type\":\"object\",\"readOnly\":true,\"ref\":\"tradle.Identity\"},\"to\":{\"type\":\"object\",\"readOnly\":true,\"ref\":\"tradle.Identity\"}}},{\"id\":\"tradle.Mortgage\",\"title\":\"Mortgage\",\"interfaces\":[\"tradle.Message\"],\"type\":\"tradle.Model\",\"forms\":[\"tradle.AboutYou\",\"tradle.YourMoney\",\"tradle.MortgageLoanDetail\"],\"subClassOf\":\"tradle.FinancialProduct\",\"properties\":{\"_t\":{\"type\":\"string\",\"readOnly\":true},\"from\":{\"type\":\"object\",\"readOnly\":true,\"ref\":\"tradle.Identity\"},\"to\":{\"type\":\"object\",\"readOnly\":true,\"ref\":\"tradle.Identity\"}}},{\"id\":\"tradle.JumboMortgage\",\"title\":\"Jumbo Mortgage\",\"interfaces\":[\"tradle.Message\"],\"type\":\"tradle.Model\",\"forms\":[\"tradle.AboutYou\",\"tradle.YourMoney\",\"tradle.MortgageLoanDetail\"],\"subClassOf\":\"tradle.FinancialProduct\",\"properties\":{\"_t\":{\"type\":\"string\",\"readOnly\":true},\"from\":{\"type\":\"object\",\"readOnly\":true,\"ref\":\"tradle.Identity\"},\"to\":{\"type\":\"object\",\"readOnly\":true,\"ref\":\"tradle.Identity\"}}},{\"id\":\"tradle.AboutYou\",\"title\":\"About You\",\"interfaces\":[\"tradle.Message\"],\"subClassOf\":\"tradle.Form\",\"type\":\"tradle.Model\",\"properties\":{\"_t\":{\"type\":\"string\",\"readOnly\":true},\"from\":{\"type\":\"object\",\"readOnly\":true,\"ref\":\"tradle.Identity\"},\"to\":{\"type\":\"object\",\"readOnly\":true,\"ref\":\"tradle.Identity\"},\"residentialStatus\":{\"type\":\"object\",\"ref\":\"tradle.ResidentialStatus\"},\"maritalStatus\":{\"type\":\"object\",\"ref\":\"tradle.MaritalStatus\"},\"dependants\":{\"type\":\"number\",\"description\":\"How many people who live with you depend on you financially?\"},\"nationality\":{\"type\":\"object\",\"ref\":\"tradle.Nationality\"},\"countryOfBirth\":{\"type\":\"object\",\"ref\":\"tradle.Country\"},\"taxResidency\":{\"type\":\"object\",\"description\":\"Country/countries in which you have tax residency (or been resident of for the past 2 years):\",\"ref\":\"tradle.Country\"},\"fundAccount\":{\"type\":\"object\",\"description\":\"How will you fund your account?\",\"ref\":\"tradle.HowToFund\"},\"purposeOfTheAccount\":{\"type\":\"object\",\"ref\":\"tradle.PurposeOfTheAccount\"},\"phones\":{\"type\":\"array\",\"items\":{\"type\":\"object\",\"properties\":{\"phoneType\":{\"type\":\"object\",\"ref\":\"tradle.PhoneTypes\"},\"number\":{\"type\":\"string\",\"keyboard\":\"phone-pad\"}}},\"required\":[\"phoneType\",\"number\"]},\"emailAddress\":{\"type\":\"string\",\"keyboard\":\"email-address\"},\"photos\":{\"type\":\"array\",\"title\":\"Photo ID snapshots\",\"items\":{\"type\":\"object\",\"properties\":{\"tags\":{\"type\":\"string\",\"skipLabel\":true},\"url\":{\"type\":\"string\",\"readOnly\":true},\"width\":{\"type\":\"number\",\"readOnly\":true},\"height\":{\"type\":\"number\",\"readOnly\":true}}},\"required\":[\"title\",\"url\"]}},\"viewCols\":[\"residentialStatus\",\"maritalStatus\",\"countryOfBirth\",\"taxResidency\",\"fundAccount\",\"purposeOfTheAccount\",\"phones\",\"emailAddress\",\"photos\"]},{\"id\":\"tradle.YourMoney\",\"title\":\"Your Money\",\"interfaces\":[\"tradle.Message\"],\"type\":\"tradle.Model\",\"subClassOf\":\"tradle.Form\",\"properties\":{\"_t\":{\"type\":\"string\",\"readOnly\":true},\"employer\":{\"type\":\"string\"},\"howLongHaveYouWorkedHere\":{\"type\":\"number\",\"units\":\"years\"},\"monthlyIncome\":{\"type\":\"object\",\"ref\":\"tradle.Money\"},\"from\":{\"type\":\"object\",\"readOnly\":true,\"ref\":\"tradle.Identity\"},\"to\":{\"type\":\"object\",\"readOnly\":true,\"ref\":\"tradle.Identity\"}},\"viewCols\":[\"employer\",\"monthlyIncome\",\"howLongHaveYouWorkedHere\"]},{\"id\":\"tradle.UtilityBillVerification\",\"type\":\"tradle.Model\",\"title\":\"Utility Bill Verification\",\"subClassOf\":\"tradle.Form\",\"interfaces\":[\"tradle.Message\"],\"style\":{\"backgroundColor\":\"#EBE1FA\"},\"properties\":{\"_t\":{\"type\":\"string\",\"readOnly\":true},\"billDate\":{\"type\":\"date\",\"displayName\":true},\"issuedBy\":{\"type\":\"string\"},\"firstName\":{\"type\":\"string\"},\"lastName\":{\"type\":\"string\"},\"city\":{\"type\":\"string\"},\"country\":{\"type\":\"object\",\"ref\":\"tradle.Country\"},\"postalCode\":{\"type\":\"string\"},\"region\":{\"type\":\"string\"},\"street\":{\"type\":\"string\"},\"formattedAddress\":{\"transient\":true,\"type\":\"string\",\"displayAs\":[\"street\",\",\",\"city\",\",\",\"region\",\"postalCode\"],\"title\":\"Address\",\"readOnly\":true},\"from\":{\"type\":\"object\",\"readOnly\":true,\"ref\":\"tradle.Identity\"},\"to\":{\"type\":\"object\",\"ref\":\"tradle.Identity\",\"displayName\":true,\"readOnly\":true},\"blockchainUrl\":{\"type\":\"string\",\"readOnly\":true},\"transactionHash\":{\"readOnly\":true,\"type\":\"string\"},\"time\":{\"type\":\"date\",\"readOnly\":true},\"photos\":{\"type\":\"array\",\"items\":{\"type\":\"object\",\"properties\":{\"tags\":{\"type\":\"string\",\"skipLabel\":true},\"url\":{\"type\":\"string\",\"readOnly\":true},\"width\":{\"type\":\"number\",\"readOnly\":true},\"height\":{\"type\":\"number\",\"readOnly\":true}}},\"required\":[\"title\",\"url\"]},\"verifications\":{\"type\":\"array\",\"readOnly\":true,\"items\":{\"backlink\":\"document\",\"ref\":\"tradle.Verification\"}}},\"required\":[\"to\",\"from\",\"photos\",\"billDate\",\"issuedBy\",\"firstName\",\"lastName\",\"city\",\"street\",\"postalCode\",\"region\"],\"gridCols\":[\"from\",\"formattedAddress\",\"billDate\",\"time\"],\"viewCols\":[\"issuedBy\",\"formattedAddress\",\"billDate\",\"time\"]},{\"id\":\"tradle.BusinessInformation\",\"title\":\"Business Information\",\"interfaces\":[\"tradle.Message\"],\"subClassOf\":\"tradle.Form\",\"type\":\"tradle.Model\",\"properties\":{\"_t\":{\"type\":\"string\",\"readOnly\":true},\"from\":{\"type\":\"object\",\"readOnly\":true,\"ref\":\"tradle.Identity\"},\"to\":{\"type\":\"object\",\"readOnly\":true,\"ref\":\"tradle.Identity\"},\"companyName\":{\"type\":\"string\"},\"DBAName\":{\"type\":\"string\",\"title\":\"DBA Name\"},\"registrationNumber\":{\"type\":\"string\"},\"registrationDate\":{\"type\":\"date\"},\"taxIdNumber\":{\"type\":\"string\",\"title\":\"Tax ID Number\"},\"officialAddress\":{\"type\":\"string\"},\"actualAddress\":{\"type\":\"string\"},\"companyPhone\":{\"type\":\"string\",\"keyboard\":\"phone-pad\"},\"companyFax\":{\"type\":\"string\",\"keyboard\":\"phone-pad\"},\"companyEmail\":{\"type\":\"string\",\"keyboard\":\"email-address\"},\"numberOfEmployees\":{\"type\":\"number\"},\"photos\":{\"type\":\"array\",\"items\":{\"type\":\"object\",\"properties\":{\"tags\":{\"type\":\"string\",\"skipLabel\":true},\"url\":{\"type\":\"string\",\"readOnly\":true},\"width\":{\"type\":\"number\",\"readOnly\":true},\"height\":{\"type\":\"number\",\"readOnly\":true}}},\"required\":[\"title\",\"url\"]}},\"viewCols\":[\"companyName\",\"registrationNumber\",\"officialAddress\",\"companyEmail\"],\"required\":[\"companyName\",\"registrationNumber\",\"registrationDate\",\"taxIdNumber\",\"officialAddress\",\"actualAddress\",\"companyPhone\",\"companyFax\",\"companyEmail\",\"numberOfEmployees\",\"photos\"]},{\"id\":\"tradle.SalesData\",\"title\":\"Sales Data for last year\",\"interfaces\":[\"tradle.Message\"],\"subClassOf\":\"tradle.Form\",\"type\":\"tradle.Model\",\"properties\":{\"_t\":{\"type\":\"string\",\"readOnly\":true},\"from\":{\"type\":\"object\",\"readOnly\":true,\"ref\":\"tradle.Identity\"},\"to\":{\"type\":\"object\",\"readOnly\":true,\"ref\":\"tradle.Identity\"},\"averageMonthlySales\":{\"type\":\"object\",\"ref\":\"tradle.Money\",\"units\":\"[min - max]\",\"description\":\"Average monthly sales\"},\"averageTxsPerMonth\":{\"type\":\"number\",\"units\":\"[min - max]\",\"description\":\"Average number of transactions per month\"},\"averageTxAmount\":{\"type\":\"object\",\"ref\":\"tradle.Money\",\"units\":\"[min - max]\",\"description\":\"Average amount of a single transaction\"},\"numberOfChargebacks\":{\"type\":\"number\"},\"volumeOfChargebacks\":{\"type\":\"object\",\"ref\":\"tradle.Money\",\"title\":\"Total amount of chargebacks\"},\"settlementCurrency\":{\"type\":\"string\"}},\"viewCols\":[\"averageMonthlySales\",\"averageTxsPerMonth\",\"averageTxAmount\",\"numberOfChargebacks\",\"volumeOfChargebacks\"],\"required\":[\"averageMonthlySales\",\"averageTxsPerMonth\",\"averageTxAmount\",\"numberOfChargebacks\",\"volumeOfChargebacks\",\"settlementCurrency\"]},{\"id\":\"tradle.MortgageLoanDetail\",\"title\":\"Mortgage Loan Details\",\"interfaces\":[\"tradle.Message\"],\"type\":\"tradle.Model\",\"subClassOf\":\"tradle.Form\",\"properties\":{\"_t\":{\"type\":\"string\",\"readOnly\":true},\"purposeOfMortgageLoan\":{\"type\":\"object\",\"ref\":\"tradle.PurposeOfMortgageLoan\"},\"totalAmountRequired\":{\"type\":\"object\",\"ref\":\"tradle.Money\"},\"totalValueOfProperty\":{\"type\":\"object\",\"ref\":\"tradle.Money\"},\"propertyStreetAddress\":{\"type\":\"string\"},\"region\":{\"type\":\"string\"},\"city\":{\"type\":\"string\"},\"postalCode\":{\"type\":\"string\"},\"country\":{\"type\":\"object\",\"ref\":\"tradle.Country\"},\"formattedAddress\":{\"transient\":true,\"type\":\"string\",\"displayAs\":[\"propertyStreetAddress\",\",\",\"city\",\",\",\"region\",\"postalCode\",\",  \",\"country\"],\"title\":\"Property Address\",\"readOnly\":true},\"propertyType\":{\"type\":\"object\",\"ref\":\"tradle.PropertyType\"},\"sizeOfProperty\":{\"type\":\"string\"},\"from\":{\"type\":\"object\",\"readOnly\":true,\"ref\":\"tradle.Identity\"},\"to\":{\"type\":\"object\",\"readOnly\":true,\"ref\":\"tradle.Identity\"}},\"viewCols\":[\"formattedAddress\",\"purposeOfMortgageLoan\",\"totalAmountRequired\",\"totalValueOfProperty\",\"propertyType\",\"sizeOfProperty\"]}]",
#   "message": "[Hello undefined!](Click for a list of products)",
#   "time": 1455593024262,
#   "welcome": true
# }
tradle$ chat easy
tradle$ chat easy: how goes, Easy Bank?
# them: Switching to representative mode is not yet implemented.
tradle$ chat easy: ok, let me know when it is
# them: Switching to representative mode is not yet implemented.
tradle$ chat easy: exit
tradle$ ls -t tradle.SimpleMessage
# Tip: use `show-obj -v <hash>` to get full metadata
# ┌─────────────────────────────────────────────┬─────────────────────────────────────────────┐
# │ Type                                        │ Hash                                        │
# ├─────────────────────────────────────────────┼─────────────────────────────────────────────┤
# │ tradle.SimpleMessage                        │ 1dc80be574be046c3e772b3b9c087728e5915dc8    │
# ├─────────────────────────────────────────────┼─────────────────────────────────────────────┤
# │ tradle.SimpleMessage                        │ 7d59fc588db86d25c7967b592f2f290353cdf47e    │
# ├─────────────────────────────────────────────┼─────────────────────────────────────────────┤
# │ tradle.SimpleMessage                        │ 96394ca0be8478d10a75572e7fe91c3b45262f1a    │
# ├─────────────────────────────────────────────┼─────────────────────────────────────────────┤
# │ tradle.SimpleMessage                        │ f0e3b4a2812cab99d0683bf37a4ccb50efd2cd51    │
# └─────────────────────────────────────────────┴─────────────────────────────────────────────┘
tradle$ show-obj 1dc80be574be046c3e772b3b9c087728e5915dc8
# {
#   "_i": "09bf4d8fe6228ab8d52b26ffdb967de28048d4c8:09bf4d8fe6228ab8d52b26ffdb967de28048d4c8",
#   "_s": "304402200ecc5aceaf74f2f537b422a19c53d6265b2595333fe501d072613baa280f99170220054b46d69a0decb66209c7a09bd2951950690703e5302f8e81099f4c1004c5e3",
#   "_t": "tradle.SimpleMessage",
#   "_z": "MABXS/OqZkox9tBt7X65cUEKwPK6jr3kDnOXeQxLcQs=",
#   "message": "how goes, Easy Bank?"
# }
tradle$ ls-txs
# 0080491d1b9d870c6dcc8a60f87fa0ba1fcc617f76e8f414ecb1dd86188367a9
# 235f8ffd7a3f5ecd5de3408cfaad0d01a36a96195ff491850257bc5c3098b28b
# 90c357e9f37a95d849677f6048838bc70a6694829c30988add3fe16af38955ac
# a605b1b60a8616a7e145834e1831d498689eb5fc212d1e8c11c45a27ea59b5f8
tradle$ show-tx a605b1b60a8616a7e145834e1831d498689eb5fc212d1e8c11c45a27ea59b5f8
# { timestamp: 1455592955861,
#   prev: [],
#   txId: 'a605b1b60a8616a7e145834e1831d498689eb5fc212d1e8c11c45a27ea59b5f8',
#   id: 10,
#   ignore: false,
#   watch: true,
#   blockId: '000000000000713cad94a1b545a0bd7f50a05f7a2fc4a141fef0745fead5e8fc',
#   confirmations: 101688,
#   blockTimestamp: 1447195775,
#   tx: '0100000001b5851ccfc50c1f5b4f41b5b29f9ceba7d165a8bab762226de9e5d05aca4fa331010000006b48304502210090e07779e4e895aef28306e0a5f13320451084b02c309021298a8042c1ba1757022033375afbf55234b2e454e58359e7fc98ad097aa00653f0eadaa62bc6c720871a012103803cb6c29def382da2a6d47a35c40bf66445aba832997c3511f5ccd79af3dabcffffffff0323020000000000001976a91413d35ad337dd80a055757e5ea0a45b59fee3060c88ac771c0200000000001976a914890ab68b990a9701a2a119d00f33fd7cc097636e88ac00000000000000001d6a1b747261646c65023b31cbee623a1795fd6ecb6fe650cc2d874be95800000000',
#   addressesFrom: [ 'mt1Zhh5P9HExGxJ1NGJ2MNt92gEd4FwpWu' ],
#   addressesTo:
#    [ 'mhKnKtPFCbYpC61buDMgSBB57mqiWvXCUo',
#      'mt1Zhh5P9HExGxJ1NGJ2MNt92gEd4FwpWu' ],
#   txType: 2,
#   txData: '3b31cbee623a1795fd6ecb6fe650cc2d874be958',
#   dir: 1,
#   errors: {},
#   dateDetected: 1455592956786,
#   timesProcessed: 3,
#   from: { _r: '3b31cbee623a1795fd6ecb6fe650cc2d874be958' },
#   _c: '3b31cbee623a1795fd6ecb6fe650cc2d874be958',
#   _r: '3b31cbee623a1795fd6ecb6fe650cc2d874be958',
#   _t: 'tradle.Identity',
#   public: true,
#   uid: '3b31cbee623a1795fd6ecb6fe650cc2d874be958-3b31cbee623a1795fd6ecb6fe650cc2d874be958-public',
#   dateUnchained: 1455592957022 }
tradle$ whoami
# Current hash: 09bf4d8fe6228ab8d52b26ffdb967de28048d4c8
# Root hash: 09bf4d8fe6228ab8d52b26ffdb967de28048d4c8
# identity status: unpublished
# {
#   "_z": "PtYlNk6OMDJg6X7+Mf2ZeYAGei6ie6kC2ktReWLs3OA=",
#   "v": "0.3",
#   "_t": "tradle.Identity",
#   "pubkeys": [
#     {
#       "type": "bitcoin",
#       "networkName": "testnet",
#       "purpose": "payment",
#       "value": "02a588d6fe8cc31cd8a828b933a811e5e24b0c3c102e36cd8f5af8fd8a28c9cc1b",
#       "fingerprint": "mgquwJZjBhBZpuVEhiDjpWctctPmc3FPfw"
#     },
#     {
#       "type": "bitcoin",
#       "networkName": "testnet",
#       "purpose": "messaging",
#       "value": "0311dd73f130a2be9bad0b5de6111b5c44be4e42e12823cef16dfb606b66087d82",
#       "fingerprint": "mwFGA1FPy5ii7sarDe42kmdxTGKhJmPYBy"
#     },
#     {
#       "type": "ec",
#       "curve": "ed25519",
#       "purpose": "sign",
#       "value": "02136d06f0caa108e964d3c0b5b02550588c363f8f8bd7081b7837dce55d8dc11c",
#       "fingerprint": "002f96b9933f0cf7d22a706100cc312e63604ae67f3be3597e9456debc46c91b"
#     },
#     {
#       "type": "ec",
#       "curve": "ed25519",
#       "purpose": "update",
#       "value": "0333fd61ed48bc8c2c1cd2dbd535306ed129992276127c6ab31082d1f6e508b54f",
#       "fingerprint": "d05cc679bff922260182a7aaf63b6f9d70aa69697a24d50a44f71715a7377e3f"
#     },
#     {
#       "type": "dsa",
#       "purpose": "sign",
#       "value": "AAAAAACA6tjxntJ7s/uP6PZXtya0nceti3sQJw7j9LGvc+Xogz/0ZgNJ1WNdFr5tu9RZDU8qkiwWK5znAnhJznrc471w4CSf/fqCadJv1HZAXg47BkKeNQtLqx787NoU5mWRLRvjFpbBnZiM2YZYCn2F26nkYdT5OOLKO0J5J5KZfUs/ALUAAAAUjsXdA5z1rVUV897dSMVLjn5ged8AAACA6DBIIdP0KW/9fphWRT3WHzrFfe40Ddw5qijkJIsWP9Jd9ggvG5QPe1Dc40RYJbgWkgwtwqXXxwkQnbdKhIETCH+pJ6QLKqJZV5v6NSRV0II4Zc4TV1eyi4LsjiEPZqjZjLQpS0Ls/6n7v96KmFq2SHadPJFxc4QZ6pmoawl5hcAAAACAIyiHN0LlC4aQNcBJv5apgULfPVDFNZ0ctinpMdwjcoTr26eQQk59biPPvSZ2jKtf4E1LfRgKkIcngJ3etyuqZf/bCrOb784xKZpzGNN1gyq+Jfu5nZ2kCxmdZ+GchCJyQ8FrPffhnvaOOve0oalNZIFvLP7kHvV0QRD74YVLXys=",
#       "fingerprint": "22817ea91ecaaa1fd01c75344468d58ee74e1a3f"
#     }
#   ]
# }
tradle$ whereami
# /Users/tenaciousmv/.tradle/klekl
tradle$ aliases
# {
#   "easy": "179d536d4fc033b0e074be8d756413302ea62805"
# }
```
