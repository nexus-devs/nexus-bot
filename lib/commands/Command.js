const Commando = require("discord.js-commando").Command
const Nexus = require("blitz-js-query")
const nexus = new Nexus({
  api_url: 'https://api.nexus-stats.com',
  auth_url: 'https://auth.nexus-stats.com'
}) // Declare here so we share the same instance in all commands

class Command extends Commando {
  constructor(client, config) {
    super(client, config)
    this.api = nexus
  }
}

module.exports = Command
