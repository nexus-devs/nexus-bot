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

      // Set tracking state for current guild
      let guild = this.api[`$${messag.message.channel.guild.id}`]
      if (!guild) {
        guild = {
          state: {}
        }
      }
      guild.state.trackTradeChat = false // will kill if condition on api subscription
     
      message.reply("Successfully unbound event listeners to `/warframe/v1/requests`")
    }
  }
}

module.exports = Untrack
