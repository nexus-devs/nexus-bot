const Command = require('../Command.js')
const config = require('../../config.js')
const { RichEmbed } = require('discord.js')

class PriceCheck extends Command {
  constructor (client) {
    super(client, {
      name: 'price-check',
      aliases: ['pc', 'pcheck'],
      group: 'prices',
      memberName: 'price-check',
      description: 'Checks an item price.',
      examples: ['price-check Frost Prime', 'price-check Volt Prime Chassis'],
      format: '<item> [component]',
      throttling: {
        usages: 5,
        duration: 10
      }
    })
  }

  async run (msg, argument) {
    msg = await msg.reply('`Processing command...`')

    argument = this.convertName(argument)
    const { args, meta } = await this.parseItemAndComponent(argument)

    if (!args['item-name']) return msg.edit('The item you\'re looking for either doesn\'t exist or isn\'t tradable.')

    // Get item price data, orders for that item and corresponding meta data
    let res, orders
    try {
      // TODO: toLowerCase() is currently needed because the cache is a bit messed up
      res = await this.api.get(`/warframe/v1/items/${args['item-name'].toLowerCase()}/prices`)
      orders = await this.api.get(`/warframe/v1/orders?item=${args['item-name']}`)
    } catch (err) {
      return msg.edit(`${err.error} ${err.reason}`)
    }

    orders = orders.filter(order => order.price !== null)

    if (args['component-name']) {
      res.components = res.components.find(comp => comp.name === args['component-name'])

      if (res.components) res.components = [res.components]
      else return msg.edit(`Couldn't find data for component '${args['component-name']}' on ${res.name}`)
    }

    const embed = new RichEmbed()
      .setColor(config.embedColor)
      .setTitle(res.name)
      .setURL('https://nexushub.co' + meta.webUrl)
      .setAuthor('NexusHub', 'https://nexushub.co/img/brand/nexushub-logo-bw.png', 'https://nexushub.co/')

    for (const comp of res.components) {
      const currentPrice = Math.round((comp.prices.buying.current.median + comp.prices.selling.current.median) / 2)
      const previousPrice = Math.round((comp.prices.buying.previous.median + comp.prices.selling.previous.median) / 2)
      const pricePercentage = Math.round((currentPrice - previousPrice) / previousPrice * 100)

      const orderTotal = comp.prices.buying.current.orders + comp.prices.selling.current.orders
      const buyerPercentage = Math.round((comp.prices.buying.current.orders / orderTotal) * 100)
      const sellerPercentage = Math.round((comp.prices.selling.current.orders / orderTotal) * 100)

      // Get the highest buy order
      let bestBuyOrder = orders.filter(order => order.offer === 'Buying' && order.component === comp.name)
      if (bestBuyOrder.length > 0) bestBuyOrder = bestBuyOrder.reduce((prev, curr) => prev.price > curr.price ? prev : curr)
      else bestBuyOrder = null

      // Get the lowest sell order
      let bestSellOrder = orders.filter(order => order.offer === 'Selling' && order.component === comp.name)
      if (bestSellOrder.length > 0) bestSellOrder = bestSellOrder.reduce((prev, curr) => prev.price < curr.price ? prev : curr)
      else bestSellOrder = null

      let percentageEmoji = pricePercentage < 0 ? '<:arrowdown:593103530613538816>' : '<:arrowup:593102737236033536>'
      let text = `\`${currentPrice}p\`     ${percentageEmoji}${pricePercentage}%\n`
      text += '```java\n'
      text += `Buyers: ${comp.prices.buying.current.orders} (${buyerPercentage}%)     Sellers: ${comp.prices.selling.current.orders} (${sellerPercentage}%)\n`

      if (!bestBuyOrder) text += 'No best buy order currently available.\n'
      else text += `Best buy order: ${bestBuyOrder.price}p from ${bestBuyOrder.user}\n`
      if (!bestSellOrder) text += 'No best sell order currently available.\n'
      else text += `Best sell order: ${bestSellOrder.price}p from ${bestSellOrder.user}`

      text += '```'
      embed.addField(`${comp.name}`, text)
    }

    return msg.edit(embed)
  }
}

module.exports = PriceCheck
