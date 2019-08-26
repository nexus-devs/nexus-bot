const Command = require('../Command.js')

class ServerCount extends Command {
  constructor (client) {
    super(client, {
      name: 'server-count',
      group: 'util',
      memberName: 'server-count',
      description: 'Shows the amount of servers this bot is running on.',
      ownerOnly: true
    })
  }

  async run (msg, args) {
    return msg.reply(`This bot is running on ${this.client.guilds.size} servers.`)
  }
}

module.exports = ServerCount
