const Command = require('../Command.js')
const config = require('../../config.js')

class PriceAlert extends Command {
  constructor (client) {
    super(client, {
      name: 'price-alert',
      aliases: ['alert', 'palert'],
      group: 'prices',
      memberName: 'price-alert',
      description: 'Alerts you when a price hits a certain threshold.',
      examples: ['price-alert \'Frost Prime\' buying above 140', 'price-alert \'Frost Prime\' selling below 120'],
      args: [{
        key: 'item-name',
        label: 'item name',
        prompt: 'What item would you like to set an alert for?',
        type: 'string'
      }, {
        key: 'order',
        label: 'order type',
        prompt: 'Which order type would you like to get notified about? (buying, selling or average)',
        type: 'string',
        oneOf: ['buying', 'selling']
      }, {
        key: 'type',
        label: 'threshold type',
        prompt: 'Would you like to set a lower (below) or upper (above) bound alert?',
        type: 'string',
        oneOf: ['below', 'above']
      }, {
        key: 'price',
        label: 'price',
        prompt: 'At what price should the alert go off?',
        type: 'integer'
      }]
    })

    // TODO: Think about component handling
    this.api.subscribe('/warframe/v1/orders', async (req) => {
      if (!client.uptime) return // make sure the client is ready
      if (!req.price || req.component !== 'Set') return

      const db = (await this.db).db(config.mongoDb)
      const collection = db.collection('price-alerts')
      const alerts = await collection.find({
        item: req.item,
        order: req.offer.toLowerCase()
      }).toArray()

      for (const alert of alerts) {
        const type = alert.type
        const threshold = alert.threshold

        // Call alert if threshold is met
        if ((type === 'above' && req.price > threshold) || (type === 'below' && req.price < threshold)) {
          let messageStub = ''
          if (alert.order === 'buying') messageStub = 'sell'
          else if (alert.order === 'selling') messageStub = 'buy'

          const user = await client.fetchUser(alert.author)
          user.send(`**Price Alert for ${alert.item}!** A ${alert.order} offer has hit ${type} \`${threshold}p\`.
User ${req.user} is ${alert.order} for \`${req.price}p\`. Message directly with:
\`/w ${req.user} Hi ${req.user}, I'd like to ${messageStub} [${alert.item} ${req.component}] for ${req.price}p. Found your offer on NexusHub.\``)
        }
      }
    })
  }

  async run (msg, args) {
    let res
    try { res = await this.api.get(`/warframe/v1/items/${args['item-name']}/prices`) }
    catch (err) {
      return msg.reply(`${err.error} ${err.reason}`)
    }

    const db = (await this.db).db(config.mongoDb)
    const collection = db.collection('price-alerts')
    const author = msg.author

    const alertCount = await collection.find({ author: author.id }).count()
    if (alertCount >= config.maxAlerts) return msg.reply(`You can't have more than ${config.maxAlerts} alerts. Delete some to make space.`)

    db.collection('price-alerts').insertOne({
      author: author.id,
      order: args['order'],
      type: args['type'],
      item: res.name,
      threshold: args['price'],
      hit: false // true if the alert was activated, reverts if threshold reverses
    })

    msg.reply(`You've successfully set an alert on ${res.name}. You'll get a private message if the ${args['order']} price goes ${args['type']} \`${args['price']}p\`.`)
  }
}

module.exports = PriceAlert
