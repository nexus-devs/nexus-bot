const Command = require('../Command.js')

class PriceAlert extends Command {
  constructor (client) {
    super(client, {
      name: 'price-alert',
      aliases: ['alert', 'palert'],
      group: 'prices',
      memberName: 'price-alert',
      description: 'Alerts you when a price hits a certain threshold.',
      examples: ['price-alert \'Frost Prime\' below 140'],
      args: [{
        key: 'item-name',
        label: 'item name',
        prompt: 'What item would you like to set an alert for?',
        type: 'string'
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
    return msg.reply(`Price for ${res.name}: \`${setPrice}p\``)
  }
}

module.exports = PriceAlert
