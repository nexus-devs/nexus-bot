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
    const db = (await this.db).db(config.mongoDb)
    const collection = db.collection('trackings')

    const trackingCountChannel = await collection.find({ channelId: msg.channel.id }).count()
    if (trackingCountChannel > 0) return msg.reply('This channel is already tracking the trade chat.')

    const trackingCountServer = await collection.find({ serverId: msg.guild.id }).count()
    if (trackingCountServer >= config.maxTrackingsPerServer) return msg.reply(`You can only track ${config.maxTrackingsPerServer} channel per server.`)

    collection.insertOne({
      serverId: msg.guild.id,
      channelId: msg.channel.id
    })

    return msg.reply('Now tracking trade chat...')
  }
}

module.exports = TrackTradechat
