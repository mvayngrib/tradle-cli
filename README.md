
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

#### Dockerized on a Mac, with local Dockerized server

Create a data volume container, same as above, then:

```bash
# get the ip of the docker-machine, used below as DOCKER_MACHINE_IP
docker-machine ip machine_name
# run tradle-cli with option: `--net host`
docker run -it --rm --name tradle-cli -e "HOME=/tdata" --volumes-from tradle-cli-data --net host tradle/cli:dev
# add local server
tradle$ addserver http://${DOCKER_MACHINE_IP}:44444
```

#### Directly on host

```bash
npm i -g @tradle/cli # you might need `sudo` depending on your setup
```

## Commands (copied & pasted from output of `help` command):

```bash
tradle$ help

  Commands:

    help [command...]                             Provides help for a given command.
    exit [options]                                Exit Tradle command line client. Please run `stop` first
    setuser <handle>                              Set acting identity
    newuser <handle>                              Create a new identity
    ls-users                                      List users
    settransport <type>                           Set transport: "ws" or "http"
    meet <identifier>                             Introduce yourself to a stranger
    simplemsg <identifier> [message]              Send a tradle.SimpleMessage to someone
    msg <identifier> [msg]                        Send a message to someone
    ls [options]                                  List stored objects
    show-obj [options] <hash>                     Print a stored object
    ls-txs                                        List tracked txs
    show-tx <txId>                                Show information stored about transaction
    watchTx <hash>                                Watch a blockchain transaction
    watchAddr <address>                           Watch a blockchain address
    forget <identifier>                           Forget someone (wipe all history with them)
    stop                                          Call this before exiting to give things a chance to clean up nicely
    whoami                                        Print your identity
    alias <alias> <identifier>                    Create an alias for a contact
    aliases                                       list aliases
    chat <identifier>                             Enter chat mode
    balance                                       Check balance
    whereami                                      Get the path to your Tradle user directory
    addserver <url>                               add a Tradle server url, and the providers running there
    ls-providers                                  list providers loaded from added server urls
    setcontactprovider <providerId> <identifier>  specify that a user with identifier <identifier> can be contacted at a specific provider
    addcontact <alias> <pathToIdentity>           add a contact
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

tradle$ newuser batman
# Generating a really good batman. This may take a few seconds...
# Generated new user "batman" in /Users/tenaciousmv/.tradle/batman
tradle$ setuser batman
# Initializing Tradle client...
tradle$ addserver http://137.117.106.253:44444
# added provider Easy Bank with alias easy
# added provider Europi Bank with alias europi
# detected tx 0080491d1b9d870c6dcc8a60f87fa0ba1fcc617f76e8f414ecb1dd86188367a9 sealing tradle.Identity with hash 179d536d4fc033b0e074be8d756413302ea62805
# detected tx 90c357e9f37a95d849677f6048838bc70a6694829c30988add3fe16af38955ac sealing tradle.Identity with hash d0b3f6780215cb8adfb9524810599b4f1f6444ae
tradle$ aliases
# {
#   "easy": "179d536d4fc033b0e074be8d756413302ea62805",
#   "europi": "d0b3f6780215cb8adfb9524810599b4f1f6444ae"
# }
tradle$ 179d536d4fc033b0e074be8d756413302ea62805
# Command "179d536d4fc033b0e074be8d756413302ea62805" not found. Looking up object with hash "179d536d4fc033b0e074be8d756413302ea62805"
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
# }
tradle$ meet easy
# ? About to send
# {
#   "_i": "cd609c4911ec776c1175823d991b534364322df7:cd609c4911ec776c1175823d991b534364322df7",
#   "_s": "304402200657bc70b715bd52d47cbb0e7d70610f4ef80a80a6b02838a30a8f35dd19237f0220069c7ebc1b7e0491b5f6527b87c46ee1bc0b5a6353381a05f326246d6cbac19b",
#   "_t": "tradle.IdentityPublishRequest",
#   "_z": "ub9eK4iR2nkYoe/WbgWT6DaUdUrzjhibbqFJTp34yoY=",
#   "identity": {
#     "_t": "tradle.Identity",
#     "_z": "CEooKT20zqiegsaF2u5MBehNkEOslSH6qla4CYaRdkc=",
#     "pubkeys": [
#       {
#         "fingerprint": "mqq1W9j9UCDbbbeCCY19RCMRAJRRTpMNYm",
#         "networkName": "testnet",
#         "purpose": "payment",
#         "type": "bitcoin",
#         "value": "0254ef9c841a7f1d244ad2233b23da802ba4b0ec2d14e62a4ae31f1b36279670f2"
#       },
#       {
#         "fingerprint": "n4qa6cfcVpFgBhaMAS7FHZZsrDMjr15YY7",
#         "networkName": "testnet",
#         "purpose": "messaging",
#         "type": "bitcoin",
#         "value": "02ec48c5540deceb8783e5458ce4491ba6f8531dd225d79d604f816bc069f50662"
#       },
#       {
#         "curve": "ed25519",
#         "fingerprint": "8508368e63c3dafa69b83d307335c10ab9df5c638a41e2809f7c00bdea6203b1",
#         "purpose": "sign",
#         "type": "ec",
#         "value": "027619cad53899d01d1bc355c38673d8ef83974d46bd888ac307ebb20da2f5f45a"
#       },
#       {
#         "curve": "ed25519",
#         "fingerprint": "84669abbdad002c0809a86974cfb3940bbbde2ae0defa1ed6ae6609321b7c183",
#         "purpose": "update",
#         "type": "ec",
#         "value": "0239f9b1f73ef548d4f9a4781516e42837d0a85b7066bb51e761a7fc279d7098c7"
#       },
#       {
#         "fingerprint": "f7d0f3493462982561216ab4d41879b19a2df861",
#         "purpose": "sign",
#         "type": "dsa",
#         "value": "AAAAAACAkwT3WIgr15//hGCuClKONcwktOifbVC5aDVJ1kim6b+SZA/WXOXbBC42NOLtIwGobJIdRu7ji/inGyrQzv93eSkpZ5ioPMkPeig7GZohXSEK1RXQpenpBVlTMz/G3z53NKdkeN4/81y2ybYA1R/+lyj8UnG/AzaDutBurxiI1JUAAAAUvGVp6u38gXw5ifA1RdmSYNPrc50AAACASXOJQzufi0tqAett6QIRfP8kyO20mHCiz97Pqag6qTbHy8dhaphRdn8z+rENwZ/0YTnlD3HqQzRVNSO3eFEQAqPTcOjCcCCqba64kfPfZ4PLiABIJvSUQ/OFG3V5AGrAv9aC3qPPPQBfflUU4HMjTJspTURsO8jOXzVX7eSEJ1sAAACAgq/qou05rCTMCCYDLLvKgm3hPRd1dSKgIf8fzhE1zYaJu/3j/tRoViQTK4IzGlAos0rMNR1nQ9FrvF9EGEI/yJO/5wHG6vTOkOKntKq2oP8b5ajVfyJGkcpL4SNw4suBmwfuRp1zfe6sK8fpDBllFTjj1HMHgrhUfckPefD5Lw0="
#       }Xw5ifA1RdmSYNPrc50AAACASXOJQzufi0tqAett6QIRfP8kyO20mHCiz97Pqag6qTbHy8dhaphRdn8z+rENwZ/0YTnlD3HqQzRVNSO3eFEQAqPTcOjCcCCqba64kfPfZ4PLiABIJvSUQ/OFG3V5AGrAv9aC3qPPPQBfflUU4HMjTJspTURsO8jOXzVX7eSEJ1sAAA    ],ou05rCTMCCYDLLvKgm3hPRd1dSKgIf8fzhE1zYaJu/3j/tRoViQTK4IzGlAos0rMNR1nQ9FrvF9EGEI/yJO/5wHG6vTOkOKntKq2oP8b5ajVfyJGkcpL4SNw4suBmwfuRp1zfe6sK8fpDBllFTjj1HMHgrhUfckPefD5Lw0="
#     "v": "0.3"
#   }
# }

# Is this OK? (yes)
y
# message queued
# delivered tradle.IdentityPublishRequest with hash 6e15361d6dfab672f6867be90345f9c3dd6381be
# received tradle.IdentityPublished with hash: 1e891e10ae9041b563640483eae2536dab79429a
# {
#   "_i": "179d536d4fc033b0e074be8d756413302ea62805:179d536d4fc033b0e074be8d756413302ea62805",
#   "_s": "30460221008f92df67204cb273d6bd14e0a9a662b9fda26b4a92d24b2b7d5ee5dfafb2f454022100d37930a9dc9e3cb40db4e6d89a6c40dd3bae9b533094ab37b0188167d5cd2f2d",
#   "_t": "tradle.IdentityPublished",
#   "_z": "6TzbnJRQRlm7NXvQ8Lg5mJL3xtWlDCEk2A9OJiPY9KU=",
#   "identity": "cd609c4911ec776c1175823d991b534364322df7",
#   "time": 1457543833259
# }
# received tradle.ProductList with hash: 5d73b13302c55879bb513c536143631e8a17b21e
# {
#   "_i": "179d536d4fc033b0e074be8d756413302ea62805:179d536d4fc033b0e074be8d756413302ea62805",
#   "_s": "304602210081633dc242dfb98f83050252285d18e767fc3f62b11d792c46c6d2cfa7fe7e71022100b0afa2b5f652a292284775d6408ee2b66588c960efd552350e003bd2e2be4173",
#   "_t": "tradle.ProductList",
#   "_z": "PAr4L17TeN7polryNzVlocPlZnd43MODB9TlmnhfaY8=",
#   "list": "[{\"id\":\"tradle.CurrentAccount\",\"type\":\"tradle.Model\",\"title\":\"Current Account\",\"interfaces\":[\"tradle.Message\"],\"subClassOf\":\"tradle.FinancialProduct\",\"forms\":[\"tradle.AboutYou\",\"tradle.YourMoney\",\"tradle.UtilityBillVerification\"],\"properties\":{\"_t\":{\"type\":\"string\",\"readOnly\":true},\"productType\":{\"type\":\"string\",\"readOnly\":true,\"displayName\":true},\"from\":{\"type\":\"object\",\"readOnly\":true,\"ref\":\"tradle.Identity\"},\"to\":{\"type\":\"object\",\"readOnly\":true,\"ref\":\"tradle.Identity\"},\"accountWith\":{\"type\":\"object\",\"readOnly\":true,\"displayName\":true,\"ref\":\"tradle.Organization\"},\"residentialStatus\":{\"type\":\"object\",\"ref\":\"tradle.ResidentialStatus\"},\"maritalStatus\":{\"type\":\"object\",\"ref\":\"tradle.MaritalStatus\"},\"dependants\":{\"type\":\"number\",\"description\":\"How many people who live with you depend on you financially?\"},\"nationality\":{\"type\":\"object\",\"ref\":\"tradle.Nationality\"},\"inUKFrom\":{\"type\":\"date\",\"description\":\"When did you arrive in the UK?\",\"title\":\"In UK from\"},\"countryOfBirth\":{\"type\":\"object\",\"ref\":\"tradle.Country\"},\"taxResidency\":{\"type\":\"object\",\"description\":\"Country/countries in which you have tax residency (or been resident of for the past 2 years):\",\"ref\":\"tradle.Country\"},\"fundAccount\":{\"type\":\"object\",\"description\":\"How will you fund your account?\",\"ref\":\"tradle.HowToFund\"},\"purposeOfTheAccount\":{\"type\":\"object\",\"ref\":\"tradle.PurposeOfTheAccount\"},\"phones\":{\"type\":\"array\",\"items\":{\"type\":\"string\",\"properties\":{\"phoneType\":{\"type\":\"string\",\"ref\":\"tradle.PhoneTypes\"},\"number\":{\"type\":\"string\",\"keyboard\":\"phone-pad\"}}},\"required\":[\"phoneType\",\"number\"]},\"emailAddress\":{\"type\":\"string\",\"keyboard\":\"email-address\"},\"employer\":{\"type\":\"object\",\"ref\":\"tradle.Organization\"},\"howLongHaveYouWorkedHere\":{\"type\":\"number\",\"units\":\"years\"},\"monthlyIncome\":{\"type\":\"object\",\"ref\":\"tradle.Money\"}}},{\"id\":\"tradle.BusinessAccount\",\"title\":\"Business Account\",\"interfaces\":[\"tradle.Message\"],\"type\":\"tradle.Model\",\"forms\":[\"tradle.BusinessInformation\",\"tradle.SalesData\"],\"subClassOf\":\"tradle.FinancialProduct\",\"properties\":{\"_t\":{\"type\":\"string\",\"readOnly\":true},\"from\":{\"type\":\"object\",\"readOnly\":true,\"ref\":\"tradle.Identity\"},\"to\":{\"type\":\"object\",\"readOnly\":true,\"ref\":\"tradle.Identity\"}}},{\"id\":\"tradle.Mortgage\",\"title\":\"Mortgage\",\"interfaces\":[\"tradle.Message\"],\"type\":\"tradle.Model\",\"forms\":[\"tradle.AboutYou\",\"tradle.YourMoney\",\"tradle.MortgageLoanDetail\"],\"subClassOf\":\"tradle.FinancialProduct\",\"properties\":{\"_t\":{\"type\":\"string\",\"readOnly\":true},\"from\":{\"type\":\"object\",\"readOnly\":true,\"ref\":\"tradle.Identity\"},\"to\":{\"type\":\"object\",\"readOnly\":true,\"ref\":\"tradle.Identity\"}}},{\"id\":\"tradle.JumboMortgage\",\"title\":\"Jumbo Mortgage\",\"interfaces\":[\"tradle.Message\"],\"type\":\"tradle.Model\",\"forms\":[\"tradle.AboutYou\",\"tradle.YourMoney\",\"tradle.MortgageLoanDetail\"],\"subClassOf\":\"tradle.FinancialProduct\",\"properties\":{\"_t\":{\"type\":\"string\",\"readOnly\":true},\"from\":{\"type\":\"object\",\"readOnly\":true,\"ref\":\"tradle.Identity\"},\"to\":{\"type\":\"object\",\"readOnly\":true,\"ref\":\"tradle.Identity\"}}},{\"id\":\"tradle.AboutYou\",\"title\":\"About You\",\"interfaces\":[\"tradle.Message\"],\"subClassOf\":\"tradle.Form\",\"type\":\"tradle.Model\",\"properties\":{\"_t\":{\"type\":\"string\",\"readOnly\":true},\"from\":{\"type\":\"object\",\"readOnly\":true,\"ref\":\"tradle.Identity\"},\"to\":{\"type\":\"object\",\"readOnly\":true,\"ref\":\"tradle.Identity\"},\"residentialStatus\":{\"type\":\"object\",\"ref\":\"tradle.ResidentialStatus\"},\"maritalStatus\":{\"type\":\"object\",\"ref\":\"tradle.MaritalStatus\"},\"dependants\":{\"type\":\"number\",\"description\":\"How many people who live with you depend on you financially?\"},\"nationality\":{\"type\":\"object\",\"ref\":\"tradle.Nationality\"},\"countryOfBirth\":{\"type\":\"object\",\"ref\":\"tradle.Country\"},\"taxResidency\":{\"type\":\"object\",\"description\":\"Country/countries in which you have tax residency (or been resident of for the past 2 years):\",\"ref\":\"tradle.Country\"},\"fundAccount\":{\"type\":\"object\",\"description\":\"How will you fund your account?\",\"ref\":\"tradle.HowToFund\"},\"purposeOfTheAccount\":{\"type\":\"object\",\"ref\":\"tradle.PurposeOfTheAccount\"},\"phones\":{\"type\":\"array\",\"items\":{\"type\":\"object\",\"properties\":{\"phoneType\":{\"type\":\"object\",\"ref\":\"tradle.PhoneTypes\"},\"number\":{\"type\":\"string\",\"keyboard\":\"phone-pad\"}}},\"required\":[\"phoneType\",\"number\"]},\"emailAddress\":{\"type\":\"string\",\"keyboard\":\"email-address\"},\"photos\":{\"type\":\"array\",\"title\":\"Photo ID snapshots\",\"items\":{\"type\":\"object\",\"properties\":{\"tags\":{\"type\":\"string\",\"skipLabel\":true},\"url\":{\"type\":\"string\",\"readOnly\":true},\"width\":{\"type\":\"number\",\"readOnly\":true},\"height\":{\"type\":\"number\",\"readOnly\":true}}},\"required\":[\"title\",\"url\"]}},\"viewCols\":[\"residentialStatus\",\"maritalStatus\",\"countryOfBirth\",\"taxResidency\",\"fundAccount\",\"purposeOfTheAccount\",\"phones\",\"emailAddress\",\"photos\"]},{\"id\":\"tradle.YourMoney\",\"title\":\"Your Money\",\"interfaces\":[\"tradle.Message\"],\"type\":\"tradle.Model\",\"subClassOf\":\"tradle.Form\",\"properties\":{\"_t\":{\"type\":\"string\",\"readOnly\":true},\"employer\":{\"type\":\"string\"},\"howLongHaveYouWorkedHere\":{\"type\":\"number\",\"units\":\"years\"},\"monthlyIncome\":{\"type\":\"object\",\"ref\":\"tradle.Money\"},\"from\":{\"type\":\"object\",\"readOnly\":true,\"ref\":\"tradle.Identity\"},\"to\":{\"type\":\"object\",\"readOnly\":true,\"ref\":\"tradle.Identity\"}},\"viewCols\":[\"employer\",\"monthlyIncome\",\"howLongHaveYouWorkedHere\"]},{\"id\":\"tradle.UtilityBillVerification\",\"type\":\"tradle.Model\",\"title\":\"Utility Bill Verification\",\"subClassOf\":\"tradle.Form\",\"interfaces\":[\"tradle.Message\"],\"style\":{\"backgroundColor\":\"#EBE1FA\"},\"properties\":{\"_t\":{\"type\":\"string\",\"readOnly\":true},\"billDate\":{\"type\":\"date\",\"displayName\":true},\"issuedBy\":{\"type\":\"string\"},\"firstName\":{\"type\":\"string\"},\"lastName\":{\"type\":\"string\"},\"city\":{\"type\":\"string\"},\"country\":{\"type\":\"object\",\"ref\":\"tradle.Country\"},\"postalCode\":{\"type\":\"string\"},\"region\":{\"type\":\"string\"},\"street\":{\"type\":\"string\"},\"formattedAddress\":{\"transient\":true,\"type\":\"string\",\"displayAs\":[\"street\",\",\",\"city\",\",\",\"region\",\"postalCode\"],\"title\":\"Address\",\"readOnly\":true},\"from\":{\"type\":\"object\",\"readOnly\":true,\"ref\":\"tradle.Identity\"},\"to\":{\"type\":\"object\",\"ref\":\"tradle.Identity\",\"displayName\":true,\"readOnly\":true},\"blockchainUrl\":{\"type\":\"string\",\"readOnly\":true},\"transactionHash\":{\"readOnly\":true,\"type\":\"string\"},\"time\":{\"type\":\"date\",\"readOnly\":true},\"photos\":{\"type\":\"array\",\"items\":{\"type\":\"object\",\"properties\":{\"tags\":{\"type\":\"string\",\"skipLabel\":true},\"url\":{\"type\":\"string\",\"readOnly\":true},\"width\":{\"type\":\"number\",\"readOnly\":true},\"height\":{\"type\":\"number\",\"readOnly\":true}}},\"required\":[\"title\",\"url\"]},\"verifications\":{\"type\":\"array\",\"readOnly\":true,\"items\":{\"backlink\":\"document\",\"ref\":\"tradle.Verification\"}}},\"required\":[\"to\",\"from\",\"photos\",\"billDate\",\"issuedBy\",\"firstName\",\"lastName\",\"city\",\"street\",\"postalCode\",\"region\"],\"gridCols\":[\"from\",\"formattedAddress\",\"billDate\",\"time\"],\"viewCols\":[\"issuedBy\",\"formattedAddress\",\"billDate\",\"time\"]},{\"id\":\"tradle.BusinessInformation\",\"title\":\"Business Information\",\"interfaces\":[\"tradle.Message\"],\"subClassOf\":\"tradle.Form\",\"type\":\"tradle.Model\",\"properties\":{\"_t\":{\"type\":\"string\",\"readOnly\":true},\"from\":{\"type\":\"object\",\"readOnly\":true,\"ref\":\"tradle.Identity\"},\"to\":{\"type\":\"object\",\"readOnly\":true,\"ref\":\"tradle.Identity\"},\"companyName\":{\"type\":\"string\"},\"DBAName\":{\"type\":\"string\",\"title\":\"DBA Name\"},\"registrationNumber\":{\"type\":\"string\"},\"registrationDate\":{\"type\":\"date\"},\"taxIdNumber\":{\"type\":\"string\",\"title\":\"Tax ID Number\"},\"officialAddress\":{\"type\":\"string\"},\"actualAddress\":{\"type\":\"string\"},\"companyPhone\":{\"type\":\"string\",\"keyboard\":\"phone-pad\"},\"companyFax\":{\"type\":\"string\",\"keyboard\":\"phone-pad\"},\"companyEmail\":{\"type\":\"string\",\"keyboard\":\"email-address\"},\"numberOfEmployees\":{\"type\":\"number\"},\"photos\":{\"type\":\"array\",\"items\":{\"type\":\"object\",\"properties\":{\"tags\":{\"type\":\"string\",\"skipLabel\":true},\"url\":{\"type\":\"string\",\"readOnly\":true},\"width\":{\"type\":\"number\",\"readOnly\":true},\"height\":{\"type\":\"number\",\"readOnly\":true}}},\"required\":[\"title\",\"url\"]}},\"viewCols\":[\"companyName\",\"registrationNumber\",\"officialAddress\",\"companyEmail\"],\"required\":[\"companyName\",\"registrationNumber\",\"registrationDate\",\"taxIdNumber\",\"officialAddress\",\"actualAddress\",\"companyPhone\",\"companyFax\",\"companyEmail\",\"numberOfEmployees\",\"photos\"]},{\"id\":\"tradle.SalesData\",\"title\":\"Sales Data for last year\",\"interfaces\":[\"tradle.Message\"],\"subClassOf\":\"tradle.Form\",\"type\":\"tradle.Model\",\"properties\":{\"_t\":{\"type\":\"string\",\"readOnly\":true},\"from\":{\"type\":\"object\",\"readOnly\":true,\"ref\":\"tradle.Identity\"},\"to\":{\"type\":\"object\",\"readOnly\":true,\"ref\":\"tradle.Identity\"},\"averageMonthlySales\":{\"type\":\"object\",\"ref\":\"tradle.Money\",\"units\":\"[min - max]\",\"description\":\"Average monthly sales\"},\"averageTxsPerMonth\":{\"type\":\"number\",\"units\":\"[min - max]\",\"description\":\"Average number of transactions per month\"},\"averageTxAmount\":{\"type\":\"object\",\"ref\":\"tradle.Money\",\"units\":\"[min - max]\",\"description\":\"Average amount of a single transaction\"},\"numberOfChargebacks\":{\"type\":\"number\"},\"volumeOfChargebacks\":{\"type\":\"object\",\"ref\":\"tradle.Money\",\"title\":\"Total amount of chargebacks\"},\"settlementCurrency\":{\"type\":\"string\"}},\"viewCols\":[\"averageMonthlySales\",\"averageTxsPerMonth\",\"averageTxAmount\",\"numberOfChargebacks\",\"volumeOfChargebacks\"],\"required\":[\"averageMonthlySales\",\"averageTxsPerMonth\",\"averageTxAmount\",\"numberOfChargebacks\",\"volumeOfChargebacks\",\"settlementCurrency\"]},{\"id\":\"tradle.MortgageLoanDetail\",\"title\":\"Mortgage Loan Details\",\"interfaces\":[\"tradle.Message\"],\"type\":\"tradle.Model\",\"subClassOf\":\"tradle.Form\",\"properties\":{\"_t\":{\"type\":\"string\",\"readOnly\":true},\"purposeOfMortgageLoan\":{\"type\":\"object\",\"ref\":\"tradle.PurposeOfMortgageLoan\"},\"totalAmountRequired\":{\"type\":\"object\",\"ref\":\"tradle.Money\"},\"totalValueOfProperty\":{\"type\":\"object\",\"ref\":\"tradle.Money\"},\"propertyStreetAddress\":{\"type\":\"string\"},\"region\":{\"type\":\"string\"},\"city\":{\"type\":\"string\"},\"postalCode\":{\"type\":\"string\"},\"country\":{\"type\":\"object\",\"ref\":\"tradle.Country\"},\"formattedAddress\":{\"transient\":true,\"type\":\"string\",\"displayAs\":[\"propertyStreetAddress\",\",\",\"city\",\",\",\"region\",\"postalCode\",\",  \",\"country\"],\"title\":\"Property Address\",\"readOnly\":true},\"propertyType\":{\"type\":\"object\",\"ref\":\"tradle.PropertyType\"},\"sizeOfProperty\":{\"type\":\"string\"},\"from\":{\"type\":\"object\",\"readOnly\":true,\"ref\":\"tradle.Identity\"},\"to\":{\"type\":\"object\",\"readOnly\":true,\"ref\":\"tradle.Identity\"}},\"viewCols\":[\"formattedAddress\",\"purposeOfMortgageLoan\",\"totalAmountRequired\",\"totalValueOfProperty\",\"propertyType\",\"sizeOfProperty\"]}]",
#   "message": "[Hello!](Click for a list of products)",
#   "time": 1457543833358,
#   "welcome": true
# }
tradle$ chat easy
tradle$ chat easy: how goes, Easy Bank?
# them: Switching to representative mode is not yet implemented.
tradle$ chat easy: exit
tradle$ ls -t tradle.SimpleMessage
# Tip: use `show-obj -v <hash>` to get full metadata
# ┌─────────────────────────────────────────────┬─────────────────────────────────────────────┐
# │ Type                                        │ Hash                                        │
# ├─────────────────────────────────────────────┼─────────────────────────────────────────────┤
# │ tradle.SimpleMessage                        │ 048252a6b29ad2a1aaf82bbf55a54cdab27f6335    │
# ├─────────────────────────────────────────────┼─────────────────────────────────────────────┤
# │ tradle.SimpleMessage                        │ 5c9d6756ba2e57b24da56f50708686384e64fdc7    │
# ├─────────────────────────────────────────────┼─────────────────────────────────────────────┤
# │ tradle.SimpleMessage                        │ a104718826374e3a315b8aa87a89ebd8adb6b28e    │
# ├─────────────────────────────────────────────┼─────────────────────────────────────────────┤
# │ tradle.SimpleMessage                        │ ae849719a7cc66ab3dc066cce2800682eef36efc    │
# ├─────────────────────────────────────────────┼─────────────────────────────────────────────┤
# │ tradle.SimpleMessage                        │ b577159f06cf1c5e461e935d32a3e9bffb82d08f    │
# ├─────────────────────────────────────────────┼─────────────────────────────────────────────┤
# │ tradle.SimpleMessage                        │ c67ca9c72f53c1b1fea24c6fd814d2859407b131    │
# └─────────────────────────────────────────────┴─────────────────────────────────────────────┘
tradle$ 048252a6b29ad2a1aaf82bbf55a54cdab27f6335
# Command "048252a6b29ad2a1aaf82bbf55a54cdab27f6335" not found. Looking up object with hash "048252a6b29ad2a1aaf82bbf55a54cdab27f6335"
# {
#   "_i": "cd609c4911ec776c1175823d991b534364322df7:cd609c4911ec776c1175823d991b534364322df7",
#   "_s": "3044022009daede2b97883a226066174c6a62c52c4d303ead2b903c1ac981e6ab7e011ce022007c090b260c8764a85f9edb9f21ea6629c33f2de2c9ce0f985c445a3a355037f",
#   "_t": "tradle.SimpleMessage",
#   "_z": "+iB9FgLEl1PimL+84DZlu+6U/SY2tx8qtY37tjV3J8g=",
#   "message": "so this is a robot?"
# }
tradle$ ls-txs
# 0080491d1b9d870c6dcc8a60f87fa0ba1fcc617f76e8f414ecb1dd86188367a9
# 90c357e9f37a95d849677f6048838bc70a6694829c30988add3fe16af38955ac
tradle$ show-tx 0080491d1b9d870c6dcc8a60f87fa0ba1fcc617f76e8f414ecb1dd86188367a9
# { timestamp: 1457543815070,
#   prev: [],
#   txId: '0080491d1b9d870c6dcc8a60f87fa0ba1fcc617f76e8f414ecb1dd86188367a9',
#   id: 8,
#   ignore: false,
#   watch: true,
#   blockId: '000000000000642b4853df10844636b514e1a612771bfd8286e9d161d37cf3a9',
#   confirmations: 123365,
#   blockTimestamp: 1447197130,
#   tx: '0100000001f0245227c5ec94cd4cbd9fbb6c64a12ed4922a1d2a357e14694967ae70c945b6000000006b48304502210087e65f11d855a66d73dd1828a4c78cab364e82c5a16c098f0966cfb91ded907402200d2651be8e9b1c46bce3aa62e4a781b8f6e8c1ffac1b66585c1f73b72dd4d58d01210306eb8025d0ce19f5e08851420924859d6b2ca02b9ef7a1f2562231a62ee04286ffffffff0323020000000000001976a91413d35ad337dd80a055757e5ea0a45b59fee3060c88ac5d360100000000001976a91448fd7bd02c2ccc97181d86dcd378887000a627d988ac00000000000000001d6a1b747261646c6502179d536d4fc033b0e074be8d756413302ea6280500000000',
#   addressesFrom: [ 'mnAtcDcS2uxPTGwZaEWinf9thWxgmrwpfn' ],
#   addressesTo:
#    [ 'mhKnKtPFCbYpC61buDMgSBB57mqiWvXCUo',
#      'mnAtcDcS2uxPTGwZaEWinf9thWxgmrwpfn' ],
#   txType: 2,
#   txData: '179d536d4fc033b0e074be8d756413302ea62805',
#   dir: 1,
#   errors: {},
#   dateDetected: 1457543815242,
#   timesProcessed: 3,
#   from: { _r: 'd0b3f6780215cb8adfb9524810599b4f1f6444ae' },
#   _c: '179d536d4fc033b0e074be8d756413302ea62805',
#   _r: '179d536d4fc033b0e074be8d756413302ea62805',
#   _t: 'tradle.Identity',
#   public: true,
#   uid: '179d536d4fc033b0e074be8d756413302ea62805-179d536d4fc033b0e074be8d756413302ea62805-public',
#   dateUnchained: 1457543815328 }
tradle$ whoami
# Current hash: cd609c4911ec776c1175823d991b534364322df7
# Root hash: cd609c4911ec776c1175823d991b534364322df7
# identity status: unpublished
# {
#   "_z": "CEooKT20zqiegsaF2u5MBehNkEOslSH6qla4CYaRdkc=",
#   "v": "0.3",
#   "_t": "tradle.Identity",
#   "pubkeys": [
#     {
#       "type": "bitcoin",
#       "networkName": "testnet",
#       "purpose": "payment",
#       "value": "0254ef9c841a7f1d244ad2233b23da802ba4b0ec2d14e62a4ae31f1b36279670f2",
#       "fingerprint": "mqq1W9j9UCDbbbeCCY19RCMRAJRRTpMNYm"
#     },
#     {
#       "type": "bitcoin",
#       "networkName": "testnet",
#       "purpose": "messaging",
#       "value": "02ec48c5540deceb8783e5458ce4491ba6f8531dd225d79d604f816bc069f50662",
#       "fingerprint": "n4qa6cfcVpFgBhaMAS7FHZZsrDMjr15YY7"
#     },
#     {
#       "type": "ec",
#       "curve": "ed25519",
#       "purpose": "sign",
#       "value": "027619cad53899d01d1bc355c38673d8ef83974d46bd888ac307ebb20da2f5f45a",
#       "fingerprint": "8508368e63c3dafa69b83d307335c10ab9df5c638a41e2809f7c00bdea6203b1"
#     },
#     {
#       "type": "ec",
#       "curve": "ed25519",
#       "purpose": "update",
#       "value": "0239f9b1f73ef548d4f9a4781516e42837d0a85b7066bb51e761a7fc279d7098c7",
#       "fingerprint": "84669abbdad002c0809a86974cfb3940bbbde2ae0defa1ed6ae6609321b7c183"
#     },
#     {
#       "type": "dsa",
#       "purpose": "sign",
#       "value": "AAAAAACAkwT3WIgr15//hGCuClKONcwktOifbVC5aDVJ1kim6b+SZA/WXOXbBC42NOLtIwGobJIdRu7ji/inGyrQzv93eSkpZ5ioPMkPeig7GZohXSEK1RXQpenpBVlTMz/G3z53NKdkeN4/81y2ybYA1R/+lyj8UnG/AzaDutBurxiI1JUAAAAUvGVp6u38gXw5ifA1RdmSYNPrc50AAACASXOJQzufi0tqAett6QIRfP8kyO20mHCiz97Pqag6qTbHy8dhaphRdn8z+rENwZ/0YTnlD3HqQzRVNSO3eFEQAqPTcOjCcCCqba64kfPfZ4PLiABIJvSUQ/OFG3V5AGrAv9aC3qPPPQBfflUU4HMjTJspTURsO8jOXzVX7eSEJ1sAAACAgq/qou05rCTMCCYDLLvKgm3hPRd1dSKgIf8fzhE1zYaJu/3j/tRoViQTK4IzGlAos0rMNR1nQ9FrvF9EGEI/yJO/5wHG6vTOkOKntKq2oP8b5ajVfyJGkcpL4SNw4suBmwfuRp1zfe6sK8fpDBllFTjj1HMHgrhUfckPefD5Lw0=",
#       "fingerprint": "f7d0f3493462982561216ab4d41879b19a2df861"
#     }
#   ]
# }
tradle$ whereami
# /Users/tenaciousmv/.tradle/batman
tradle$ simplemsg easy "[application for](tradle.CurrentAccount)"
# ? sign the message? (yes)
y
# sig: 304402200bc1cc12095f70951371640c360488562580c6ff081f18482c1843a1d0484fd30220055672d59b69f993c74207fc81eb1916ffdf1e86db982110d795b3599a0be3c2
# ? About to send
# {
#   "_i": "cd609c4911ec776c1175823d991b534364322df7:cd609c4911ec776c1175823d991b534364322df7",
#   "_s": "304402200bc1cc12095f70951371640c360488562580c6ff081f18482c1843a1d0484fd30220055672d59b69f993c74207fc81eb1916ffdf1e86db982110d795b3599a0be3c2",
#   "_t": "tradle.SimpleMessage",
#   "_z": "7npTbVEYyqEdB4ZDSMrhw9I7Z70r6juXj4+X91EQvp4=",
#   "message": "[application for](tradle.CurrentAccount)"
# }
#
# Is this OK? (yes)
y
# message queued
# delivered tradle.SimpleMessage with hash b1c607dadf62adb819306e015f19c3579f1187b2
# received tradle.SimpleMessage with hash: f4fff5a6bc792578f0dd31e638dbf07db7339e33
# {
#   "_i": "179d536d4fc033b0e074be8d756413302ea62805:179d536d4fc033b0e074be8d756413302ea62805",
#   "_s": "3046022100ef0f1cb2cce67c54459bc5c90f9b588ced208dd93e6ab9f1693620de8e06b584022100b52bcb33878533dfb4aa36eb5fd08a72950817e2f41c267458ab939fe9f46b8c",
#   "_t": "tradle.SimpleMessage",
#   "_z": "vLX67BHCP3UuPsaK2T5m9Rtxi2GqGva93rxHuViemVU=",
#   "message": "[Please fill out this form and attach a snapshot of the original document](tradle.AboutYou)",
#   "time": 1457543927142
# }
tradle$ msg easy
# type (tradle.SimpleMessage)
tradle.AboutYou
# type: tradle.AboutYou
# ? Add more properties? (yes)
n
# ? sign the message? (yes)
y
# sig: 304402200e676253105901f2882820c42952b8e7d4d09a89d41b3c985f73a745455d8dd7022003176d83cb5ec32744bcbf73f609d48697b7f1a61139b3588f5edc2b59b354c5
# ? About to send
# {
#   "_i": "cd609c4911ec776c1175823d991b534364322df7:cd609c4911ec776c1175823d991b534364322df7",
#   "_s": "304402200e676253105901f2882820c42952b8e7d4d09a89d41b3c985f73a745455d8dd7022003176d83cb5ec32744bcbf73f609d48697b7f1a61139b3588f5edc2b59b354c5",
#   "_t": "tradle.AboutYou",
#   "_z": "5zCMwrNSbUpJZHagkAKcLK+ZP3hnUL1K2H6qn/Qa4ls="
# }
#
# Is this OK? (yes)
y
# message queued
# delivered tradle.AboutYou with hash ca8ea988e1872446bfb6a1808adedc3b8f0ce3b4
# received tradle.Verification with hash: 9d9707c4a3372d2cb28c658e5b24a495959bba41
# {
#   "_i": "179d536d4fc033b0e074be8d756413302ea62805:179d536d4fc033b0e074be8d756413302ea62805",
#   "_s": "3045022100c4cb2be799ec5f7f510cb6d77f299208e3d18699351b499190cc6f7682ca6ebd02205a09d186e9c4466e42f645283a1e004028a78afe44a071a9fd5bd53f817e1d4e",
#   "_t": "tradle.Verification",
#   "_z": "6fblP6n7eEYIbO1Q5kt3lEPonAcJcRqZjOzpEPD8nfs=",
#   "document": {
#     "id": "tradle.AboutYou_ca8ea988e1872446bfb6a1808adedc3b8f0ce3b4",
#     "title": "tradle.AboutYou"
#   },
#   "documentOwner": {
#     "id": "tradle.Identity_cd609c4911ec776c1175823d991b534364322df7"
#   },
#   "organization": {
#     "id": "tradle.Organization_71e4b7cd6c11ab7221537275988f113a879029eb_71e4b7cd6c11ab7221537275988f113a879029eb",
#     "title": "Easy Bank"
#   },
#   "time": 1457543936387
# }
# received tradle.SimpleMessage with hash: 42a2977e1a0695e9244a5a64d6c93013df050095
# {
#   "_i": "179d536d4fc033b0e074be8d756413302ea62805:179d536d4fc033b0e074be8d756413302ea62805",
#   "_s": "3046022100d6afa428f46cabbebe9405caa5f327712fa18499a9926948fe6872e8f48e7e00022100adba13ac4b511b8f83f73e5df931d7194e91d9c9b4143a2d5b590a5bb4cdc92e",
#   "_t": "tradle.SimpleMessage",
#   "_z": "SPZjeIKN2GkPRP7dwIrJuL8WM7qaac7xNp9cID9aO3Q=",
#   "message": "[Please fill out this form and attach a snapshot of the original document](tradle.YourMoney)",
#   "time": 1457543936425
# }
# .. some time later
# detected tx be7dcaded29053633166d42fda63f60788b845f0713a9fc1dcb5dd9b280d74eb sealing tradle.Verification with hash 9d9707c4a3372d2cb28c658e5b24a495959bba41
```
