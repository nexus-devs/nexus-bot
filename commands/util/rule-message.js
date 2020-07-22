const Command = require('../Command.js')
const config = require('../../config.js')

class ServerCount extends Command {
  constructor (client) {
    super(client, {
      name: 'rule-message',
      group: 'util',
      memberName: 'rule-message',
      description: 'Have the bot display a message that contains all assignable roles.',
      ownerOnly: true
    })
  }

  async run (msg, args) {
    let reply = 'React with the following emojis to this message to have a role assigned to you:'
    for (const role of config.roleReactions) {
      reply += `\n${role.reaction} - ${role.role}`
    }

    return msg.say(reply, { reply: '' })
  }
}

module.exports = ServerCount
