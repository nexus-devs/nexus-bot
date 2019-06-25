const Commando = require('discord.js-commando').Command
const MongoClient = require('mongodb').MongoClient
const Nexus = require('cubic-client')
const nexusConfig = require('../config.js')

// Declare here so we share the same instance in all commands
const nexus = new Nexus({
  api_url: nexusConfig.api_url,
  auth_url: nexusConfig.auth_url
})

class Command extends Commando {
  constructor (client, config) {
    super(client, config)
    this.api = nexus
    this.db = MongoClient.connect(nexusConfig.mongoUrl)
  }
}

module.exports = Command