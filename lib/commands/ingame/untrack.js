const Discord = require("discord.js-commando")

class Untrack extends Discord.Command {
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
            nexus.connection.client.off("/warframe/v1/requests")
            message.reply("Successfully unbound event listeners to `/warframe/v1/requests`")
        }
    }
}

module.exports = Untrack
