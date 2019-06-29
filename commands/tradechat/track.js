const Command = require('../Command.js')
const config = require('../../config.js')

class TrackTradechat extends Command {
  constructor (client) {
    super(client, {
      name: 'track',
      group: 'tradechat',
      memberName: 'track',
      description: 'Tracks the ingame trade chat in the current channel.',
      examples: ['track'],
      guildOnly: true,
      userPermissions: [config.trackingPermission]
    })
  }

  async run (msg, args) {
    return msg.reply('Now tracking trade chat...')
  }
}

module.exports = TrackTradechat
