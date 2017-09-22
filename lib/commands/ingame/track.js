const Command = require('../Command.js')
const RichEmbed = require('discord.js').RichEmbed

class Track extends Command {
  constructor(client) {
    super(client, {
      name: 'track',
      group: 'ingame',
      memberName: 'track',
      description: 'Track the live-feed of in-game bots.'
    })
  }

  async run(message, args) {
    args = args.split(' ')

    if (args[0].toLowerCase() === 'tradechat') {
      let status = await this.api.get('/warframe/v1/bots/status')
      let previous = {
        user: 'Nexus-Sentry',
        text: 'Trade chat data provided by www.this.api-stats.com',
        region: 'North America (NA) / Europe (EU)'
      }

      // Set tracking state for current guild
      let guild = this.api[`$${message.message.channel.guild.id}`]
      if (!guild) {
        guild = {
          state: {}
        }
      }
      guild.state.trackTradeChat = true // will be overriden on untrack

      // Show online status of Nexus-sentry on start
      message.reply(`Started tracking tradechat. Nexus-Sentry status: ${status['Chat-Sentry'].online ? '\`online\`' : '\`offline\`'}`)

      // Subscribe to API
      this.api.subscribe('/warframe/v1/requests')
      this.api.subscribe('/warframe/v1/game/updates')

      // Post on subscription updates
      this.api.on('/warframe/v1/requests', async req => {
        if (guild.state.trackTradeChat && req.subMessage) {
          let current = {}
          let item = await this.api.get(`/warframe/v1/items/${req.item}`)

          /**
           * Link item names to nexus-stats
           */
          let url = `https://nexus-stats.com/${item.type}/${item.name.replace(' Prime', '').split(' ').join('%20')}`
          current = {
            user: req.user,
            text: req.subMessage.replace(new RegExp( `(${req.item})`, 'gi' ), `[${req.item}](${url})`),
            region: 'Region: ' + req.region,
          }

          // Text cleanup
          current.text = current.text.split('platinum').join('').split('plat').join('')

          // Assign WTS/WTB if missing due to bad timing on incoming requests
          if (!current.text.toLowerCase().includes('wts') && !current.text.toLowerCase().includes('wtb')) {
            current.text = current.text.split(' ')
            current.text.unshift(req.offer === 'Selling' ? 'WTS' : 'WTB')
            current.text = current.text.join(' ')
          }

          /**
           * Find location of price value and show diff to median
           */
          let stats = await this.api.get(`/warframe/v1/items/${req.item}/statistics`)
          let comp = null
          stats.components.forEach(component => {
            if (component.name === req.component) comp = component
          })

          let diff = req.price - comp.median
          current.text = current.text.split(' ')
          current.text.forEach((word, index) => {
            if (word.includes(req.price)) {
              current.text[index] = `**${req.price}p** (\` ${diff > 0 ? '+' + diff : diff}p\`)`
            }
          })
          current.text = current.text.join(' ')

          /**
           * Extend previous message if same user, otherwise send
           */
          if (current.user === previous.user) {
            current.text = previous.text + ' ' + current.text
          }
          else {
            message.embed(new RichEmbed().setDescription(previous.text).setAuthor(previous.user).setFooter(previous.region))
          }
          previous = current
        }
      })
      this.api.on('/warframe/v1/updates', () => {
        message.channel.sendMessage('Nexus-Sentry temporarily offline. Reason: Warframe requires updates.')
      })
    }
  }
}

module.exports = Track
