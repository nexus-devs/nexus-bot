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
    // Get item price data
    let res
    try { res = await this.api.get(`/warframe/v1/items/${args['item-name']}/prices`) }
    catch (err) {
      return msg.reply(`${err.error} ${err.reason}`)
    }

    // Get all orders corresponding to that item
    let orders
    try { orders = await this.api.get(`/warframe/v1/orders?item=${args['item-name']}`) }
    catch (err) {
      return msg.reply(`${err.error} ${err.reason}`)
    }
    orders = orders.filter(order => order.price !== null)

    const embed = new RichEmbed()
      .setColor('#11acb2')
      .setTitle(res.name)
      .setAuthor('NexusHub', 'https://nexushub.co/img/brand/nexushub-logo-bw.png', 'https://nexushub.co/')
      .setTimestamp()

    for (const comp of res.components) {
      const currentPrice = Math.round((comp.prices.buying.current.median + comp.prices.selling.current.median) / 2)
      const previousPrice = Math.round((comp.prices.buying.previous.median + comp.prices.selling.previous.median) / 2)
      const pricePercentage = Math.round((currentPrice - previousPrice) / previousPrice * 100)

      const orderTotal = comp.prices.buying.current.orders + comp.prices.selling.current.orders
      const buyerPercentage = Math.round((comp.prices.buying.current.orders / orderTotal) * 100)
      const sellerPercentage = Math.round((comp.prices.selling.current.orders / orderTotal) * 100)

      // Get the highest buy order and the lowest sell order
      const bestBuyOrder = orders.filter(order => order.offer === 'Buying' && order.component === comp.name)
        .reduce((prev, curr) => prev.price > curr.price ? prev : curr)
      const bestSellOrder = orders.filter(order => order.offer === 'Selling' && order.component === comp.name)
        .reduce((prev, curr) => prev.price < curr.price ? prev : curr)

      let percentageEmoji = pricePercentage < 0 ? '<:arrowdown:593103530613538816>' : '<:arrowup:593102737236033536>'
      let text = `${currentPrice}p     ${percentageEmoji}${pricePercentage}%\n`
      text += `Buyers: ${comp.prices.buying.current.orders} (${buyerPercentage}%)     Sellers: ${comp.prices.selling.current.orders} (${sellerPercentage}%)\n`
      text += `Best buy order: ${bestBuyOrder.price}p from \`${bestBuyOrder.user}\`\n`
      text += `Best sell order: ${bestSellOrder.price}p from \`${bestSellOrder.user}\``

      embed.addField(`${comp.name}`, text)
    }
    return msg.reply(embed)
  }
}

module.exports = PriceCheck
