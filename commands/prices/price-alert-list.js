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
    msg.reply(`Lol: ${args['list-item']}`)
  }
}

module.exports = PriceAlert
