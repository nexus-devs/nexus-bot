const Command = require('../Command.js')

class Untrack extends Command {
  constructor(client) {
    super(client, {
      name: "untrack",
      group: "ingame",
      memberName: "untrack",
      description: "Track the live-feed of in-game bots."
    })
  }

  async run(message, args) {
    args = args.split(" ")

    if (args[0].toLowerCase() === "tradechat") {
      let guild = message.message.channel.guild.id

      // Set tracking state for current guild
      if (!this.api[`$${guild}`]) {
        this.api[`$${guild}`] = {
          state: {}
        }
      }
      this.api[`$${guild}`].state.trackTradeChat = false // will kill if condition on api subscription
      
      message.reply("Successfully unbound event listeners to `/warframe/v1/requests`")
    }
  }
}

module.exports = Untrack
