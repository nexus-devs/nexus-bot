const Command = require('../Command.js')
const config = require('../../config.js')
const { RichEmbed } = require('discord.js')

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

    this.api.subscribe('/warframe/v1/orders', async (req) => {
      if (!client.uptime) return // make sure the client is ready
      if (req.source !== 'Trade Chat' || !req.message) return
      console.log(req)

      const db = (await this.db).db(config.mongoDb)
      const collection = db.collection('trackings')
      const trackings = await collection.find({}).toArray()

      for (const tr of trackings) {
        const channel = client.channels.get(tr.channelId)
        if (!channel) return collection.deleteOne({ _id: tr._id }) // delete non-existing channels

        const embed = new RichEmbed()
          .setColor('#11acb2')
          .setTitle(req.user)
          .setDescription(req.message)
          .setFooter(`Platform: ${req.platform}, Region: Unknown`)

        channel.send(embed)
      }
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
