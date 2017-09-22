const Commando = require("discord.js-commando").Command
const Nexus = require("nexus-stats-api")
const nexus = new Nexus() // Declare here so we share the same instance in all commands

class Command extends Commando {
  constructor(client, config) {
    super(client, config)
    this.api = nexus
  }
}

module.exports = Command
