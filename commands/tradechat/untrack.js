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
    const db = (await this.db).db(config.mongoDb)

    const deleteOp = await db.collection('trackings').deleteOne({ channelId: msg.channel.id })
    if (deleteOp.deletedCount < 1) return msg.reply('This channel is not tracking currently.')

    return msg.reply('Untracked trade chat.')
  }
}

module.exports = UntrackTradechat
