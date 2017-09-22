const Command = require('../Command.js')
const RichEmbed = require('discord.js').RichEmbed

class Track extends Command {
  constructor(client) {
    super(client, {
      name: 'my',
      group: 'ingame',
      memberName: 'memes',
      description: 'Track the live-feed of in-game bots.'
    })
  }

  async run(message, args) {
    if (args.toLowerCase() === 'name is niggeles') {
      this.loop(message)
    }
  }

  post(message) {
    message.embed(new RichEmbed().setAuthor(':cykablyat:').setImage('http://i.imgur.com/N5eitl8.png'))
  }

  loop(message) {
    let rand = Math.round(Math.random() * (3000 - 500)) + 500
    setTimeout(() => {
      this.post(message)
      this.loop(message)
    }, rand)
  }
}

module.exports = Track
