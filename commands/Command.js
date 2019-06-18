const Commando = require('discord.js-commando').Command
const Nexus = require('cubic-client')
const nexus = new Nexus({
  api_url: 'wss://api.nexushub.co/ws',
  auth_url: 'wss://auth.nexushub.co/ws'
}) // Declare here so we share the same instance in all commands
// TODO: Admin client with discord.js throttling

class Command extends Commando {
  constructor (client, config) {
    super(client, config)
    this.api = nexus
  }
}

module.exports = Command
