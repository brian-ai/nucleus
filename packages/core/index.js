require('dotenv').config()
require = require('esm')(module)
const { init } = require('@brian-ai/brain')

module.exports = init()
