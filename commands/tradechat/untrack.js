const Command = require('../Command.js')
const config = require('../../config.js')

class UntrackTradechat extends Command {
  constructor (client) {
    super(client, {
      name: 'untrack',
      group: 'tradechat',
      memberName: 'untrack',
      description: 'Untracks the ingame trade chat in the current channel.',
      examples: ['untrack'],
      guildOnly: true,
      userPermissions: [config.trackingPermission]
    })
  }

  async run (msg, args) {
    return msg.reply('Untracked trade chat')
  }
}

module.exports = UntrackTradechat
