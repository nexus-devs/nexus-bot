const Command = require('../Command.js')

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

    const set = res.components.find((comp) => { return comp.name === 'Set' })
    if (!set) return msg.reply('Could not fetch a general price')

    const currentPrice = Math.round((set.prices.buying.current.median + set.prices.selling.current.median) / 2)
    const previousPrice = Math.round((set.prices.buying.previous.median + set.prices.selling.previous.median) / 2)
    const pricePercentage = Math.round((currentPrice - previousPrice) / previousPrice * 100)

    const orderTotal = set.prices.buying.current.orders + set.prices.selling.current.orders
    const buyerPercentage = Math.round((set.prices.buying.current.orders / orderTotal) * 100)
    const sellerPercentage = Math.round((set.prices.selling.current.orders / orderTotal) * 100)

    // Get the highest buy order and the lowest sell order
    orders = orders.filter(order => order.price !== null)
    const bestBuyOrder = orders.filter(order => order.offer === 'Buying' && order.component === 'Set')
      .reduce((prev, curr) => prev.price > curr.price ? prev : curr)
    const bestSellOrder = orders.filter(order => order.offer === 'Selling' && order.component === 'Set')
      .reduce((prev, curr) => prev.price < curr.price ? prev : curr)

    let percentageEmoji = pricePercentage < 0 ? '<:arrowdown:593103530613538816>' : '<:arrowup:593102737236033536>'
    let text = `**${res.name}: ${currentPrice}p**     ${percentageEmoji}${pricePercentage}%\n`
    text += '─────────────────────────\n'
    text += `Buyers: ${set.prices.buying.current.orders} (${buyerPercentage}%)     Sellers: ${set.prices.selling.current.orders} (${sellerPercentage}%)\n`
    text += `Best buy order: ${bestBuyOrder.price}p from \`${bestBuyOrder.user}\`\n`
    text += `Best sell order: ${bestSellOrder.price}p from \`${bestSellOrder.user}\`\n`
    return msg.reply(text)
  }
}

module.exports = PriceCheck
