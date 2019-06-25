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
    let res
    try { res = await this.api.get(`/warframe/v1/items/${args['item-name']}/prices`) }
    catch (err) {
      return msg.reply(`${err.error} ${err.reason}`)
    }

    const set = res.components.find((comp) => { return comp.name === 'Set' })
    if (!set) return msg.reply('Could not fetch a general price')

    const setPrice = Math.round((set.prices.buying.current.median + set.prices.selling.current.median) / 2)
    const orderTotal = set.prices.buying.current.orders + set.prices.selling.current.orders
    const buyerPercentage = Math.round((set.prices.buying.current.orders / orderTotal) * 100)
    const sellerPercentage = Math.round((set.prices.selling.current.orders / orderTotal) * 100)

    let text = `**${res.name}: ${setPrice}p**     <:arrowdown:593103530613538816>5p\n`
    text += '────────────────────────────────\n'
    text += `Buyers: ${set.prices.buying.current.orders} (${buyerPercentage}%)     Sellers: ${set.prices.selling.current.orders} (${sellerPercentage}%)`
    return msg.reply(text)
  }
}

module.exports = PriceCheck
