const Command = require('../Command.js')
const { RichEmbed } = require('discord.js')

class PriceCheck extends Command {
  constructor (client) {
    super(client, {
      name: 'price-check',
      aliases: ['pc', 'pcheck'],
      group: 'prices',
      memberName: 'price-check',
      description: 'Checks an item price.',
      examples: ['price-check Frost Prime'],
      args: [{
        key: 'item-name',
        label: 'item name',
        prompt: 'What item would you like to price check?',
        type: 'string'
      }]
    })
  }

  async run (msg, args) {
    // Get item price data, orders for that item and corresponding meta data
    let res, orders, meta
    try {
      res = await this.api.get(`/warframe/v1/items/${args['item-name']}/prices`)
      orders = await this.api.get(`/warframe/v1/orders?item=${args['item-name']}`)
      meta = await this.api.get(`/warframe/v1/items/${args['item-name']}`)
    } catch (err) {
      return msg.reply(`${err.error} ${err.reason}`)
    }

    orders = orders.filter(order => order.price !== null)

    const embed = new RichEmbed()
      .setColor('#11acb2')
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
      let text = `${currentPrice}p     ${percentageEmoji}${pricePercentage}%\n`
      text += `Buyers: ${comp.prices.buying.current.orders} (${buyerPercentage}%)     Sellers: ${comp.prices.selling.current.orders} (${sellerPercentage}%)\n`

      if (!bestBuyOrder) text += 'No best buy order currently available.\n'
      else text += `Best buy order: ${bestBuyOrder.price}p from \`${bestBuyOrder.user}\`\n`
      if (!bestSellOrder) text += 'No best sell order currently available.\n'
      else text += `Best sell order: ${bestSellOrder.price}p from \`${bestSellOrder.user}\``

      embed.addField(`${comp.name}`, text)
    }
    return msg.reply(embed)
  }
}

module.exports = PriceCheck
