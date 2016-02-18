#!/usr/bin/env node
'use strict'

if (!('DEBUG' in process.env)) {
  process.env.DEBUG = '*'
}

require('./').cli.show()
