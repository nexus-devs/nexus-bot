const Command = require('../Command.js')
const config = require('../../config.js')
const { RichEmbed } = require('discord.js')

class PriceAlert extends Command {
  constructor (client) {
    super(client, {
      name: 'price-alert',
      aliases: ['alert', 'palert'],
      group: 'prices',
      memberName: 'price-alert',
      description: 'Alerts you when a price hits a certain threshold.',
      examples: ['price-alert Frost Prime buying above 140', 'price-alert Volt Prime Chassis selling below 120'],
      format: '<item> [component] [order type] [threshold type] <price>'
    })

    this.api.subscribe('/warframe/v1/orders', async (req) => {
      if (!client.uptime) return // make sure the client is ready
      if (!req.price) return

      const db = (await this.db).db(config.mongoDb)
      const collection = db.collection('price-alerts')
      const alerts = await collection.find({
        item: req.item,
        component: req.component,
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

          let text = `A ${alert.order} offer has hit ${type} \`${threshold}p\`.\n\n`
          text += `User ${req.user} is ${alert.order} for \`${req.price}p\`. Message directly with:\n`
          text += `\`/w ${req.user} Hi ${req.user}, I'd like to ${messageStub} [${alert.item} ${req.component}] for ${req.price}p. Found your offer on NexusHub.\``

          const embed = new RichEmbed()
            .setColor(config.embedColor)
            .setTitle(`Price Alert for ${alert.item} ${alert.component}!`)
            .setDescription(text)

          const user = await client.fetchUser(alert.author)
          user.send(embed)
        }
      }
    })
  }

  async run (msg, argument) {
    // Default vars, undefined used only for documentation
    let cmdArgs = {}
    cmdArgs['order'] = 'buying'
    cmdArgs['type'] = undefined
    cmdArgs['price'] = undefined

    // Parse arguments
    argument = argument.split(' ')
    for (let i = argument.length - 1; i >= 0; i--) {
      let parsedArg = true
      const arg = argument[i].toLowerCase()

      if (!isNaN(parseInt(arg))) {
        cmdArgs['price'] = parseInt(arg)
      } else if (['below', 'above'].includes(arg)) {
        cmdArgs['type'] = arg
      } else if (['buying', 'selling'].includes(arg)) {
        cmdArgs['order'] = arg
      } else parsedArg = false

      if (parsedArg) argument.splice(i, 1)
    }

    if (!cmdArgs['price']) return msg.reply('No price argument given, or it\'s not a number.')

    // Set default threshold type
    if (!cmdArgs['type']) cmdArgs['type'] = cmdArgs['order'] === 'buying' ? 'above' : 'below'

    // Parse item
    argument = this.convertName(argument.join(' '))
    let { args } = await this.parseItemAndComponent(argument)
    args = { ...args, ...cmdArgs }
    args['component-name'] = args['component-name'] ? args['component-name'] : 'Set'

    let res
    // TODO: toLowerCase() is currently needed because the cache is a bit messed up
    try { res = await this.api.get(`/warframe/v1/items/${args['item-name'].toLowerCase()}/prices`) }
    catch (err) {
      return msg.reply(`${err.error} ${err.reason}`)
    }

    const component = res.components.find(comp => comp.name === args['component-name'])
    if (!component) return msg.reply(`Component ${args['component-name']} isn't available for this item.`)

    const db = (await this.db).db(config.mongoDb)
    const collection = db.collection('price-alerts')
    const author = msg.author

    const alertCount = await collection.find({ author: author.id }).count()
    if (alertCount >= config.maxAlerts) return msg.reply(`You can't have more than ${config.maxAlerts} alerts. Delete some to make space.`)

    collection.insertOne({
      author: author.id,
      order: args['order'],
      type: args['type'],
      item: res.name,
      component: args['component-name'],
      threshold: args['price']
    })

    return msg.reply(`You've successfully set an alert on ${res.name} ${args['component-name']}. You'll get a private message if the ${args['order']} price goes ${args['type']} \`${args['price']}p\`.`)
  }
}

module.exports = PriceAlert