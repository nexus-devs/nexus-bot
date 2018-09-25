const Command = require('../Command.js')
const RichEmbed = require('discord.js').RichEmbed

class Track extends Command {
  constructor (client) {
    super(client, {
      name: 'track',
      group: 'ingame',
      memberName: 'track',
      description: 'Track the live-feed of in-game bots.'
    })
  }

  async run (message, args) {
    args = args.split(' ')

    if (args[0].toLowerCase() === 'tradechat') {
      let timer = new Date()
      let sentWarning = false
      let previous = {
        user: 'Nexus-Sentry',
        text: 'Trade chat data provided by www.nexus-stats.com',
        region: 'North America (NA) / Europe (EU)'
      }

      // Show online status of Nexus-sentry on start
      message.reply(`Started tracking tradechat.`)

      // Subscribe to API
      this.api.subscribe('/warframe/v1/requests')
      this.api.subscribe('/warframe/v1/game/updates')

      // Post on subscription updates
      this.api.on('/warframe/v1/requests', async req => {
        timer = new Date() // reset timer for notification about inactivity
        sentWarning = false
        let current = {}
        let item = (await this.api.get(`/warframe/v1/search?query=${encodeURIComponent(req.item)}`))[0]

        /**
         * Link item names to nexus-stats
         */
        current = {
          user: req.user,
          text: req.subMessage.replace(new RegExp(`(${req.item})`, 'gi'), (item ? `[${req.item}](https://beta.nexus-stats.com${item.webUrl})` : req.item)),
          region: 'Region: ' + req.region
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

        let diff = req.price - comp.combined.median
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

        // Prevent empty messages
        } else if(previous.text.length > 4) {
          message.channel.send({
            embed: {
              color: (req.offer === 'Selling') ? '6871185' : '3447003',
              title: previous.user,
              description: previous.text,
              timestamp: new Date(),
              footer: {
                text: `Region: ${previous.region}`
              }
            }
          })
        }
        previous = current
      })

      /**
       * If no new message has been sent for 5 minutes - Ping owner.
       */
      setInterval(() => {
        if (new Date() - timer > 1000 * 60 * 5 && !sentWarning) {
          message.reply('Didn\'t receive new orders for 5 minutes. Are you sure the bots are still running?')
          sentWarning = true
        }
      }, 500)
    }
  }
}

module.exports = Track
