const Command = require('../Command.js')
const config = require('../../config.js')

class PriceAlert extends Command {
  constructor (client) {
    super(client, {
      name: 'price-alert-list',
      aliases: ['alert-list', 'palert-list'],
      group: 'prices',
      memberName: 'price-alert-list',
      description: 'Shows a list of your current alerts. Also allows you to operate on them.',
      examples: ['price-alert-list', 'price-alert-list delete 2'],
      args: [{
        key: 'operation',
        label: 'operation',
        prompt: 'What would you like to do (list, delete)?',
        type: 'string',
        oneOf: ['list', 'delete'],
        default: 'list'
      }, {
        key: 'list-item',
        label: 'list item',
        prompt: 'Which item on the list would you like to operate on?',
        type: 'integer',
        min: 1,
        default: 0
      }]
    })
  }

  async run (msg, args) {
    const operation = args['operation']

    const db = (await this.db).db(config.mongoDb)
    const collection = db.collection('price-alerts')
    const author = msg.author
    const listItem = args['list-item']

    const alerts = await collection.find({ author: author.id }).sort({ '$natural': 1 }).toArray()

    if (operation === 'list' || listItem === 0) {
      let text = 'You have the following alerts set:\n'
      if (operation !== 'list') text = 'Choose one of the following items:\n'

      for (let i = 0; i < alerts.length; i++) {
        const alert = alerts[i]
        text += `\t${i + 1}) ${alert.item} ${alert.component} ${alert.order} ${alert.type} \`${alert.threshold}p\`\n`
      }
      return msg.reply(text)
    } else if (operation === 'delete') {
      collection.deleteOne({ _id: alerts[listItem - 1]._id })
      return msg.reply('Successfully deleted chosen alert!')
    }
  }
}

module.exports = PriceAlert
