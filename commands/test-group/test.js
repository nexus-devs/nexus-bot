const Command = require('discord.js-commando').Command

class TestCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'test-command',
      group: 'test-group',
      memberName: 'test',
      description: 'Tests the command framework.'
    })
  }

  async run (msg, args) {
    return msg.reply('You ran the test command!')
  }
}

module.exports = TestCommand
