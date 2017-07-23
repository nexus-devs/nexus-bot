const Command = require("discord.js-commando").Command
const RichEmbed = require("discord.js").RichEmbed

class Track extends Command {
    constructor(client) {
        super(client, {
            name: "track",
            group: "ingame",
            memberName: "track",
            description: "Track the live-feed of in-game bots."
        })
    }

    async run(message, args) {
        args = args.split(" ")

        if (args[0].toLowerCase() === "tradechat") {
            let status = await nexus.get("/warframe/v1/bots/status")
            let previous = {
                user: "Nexus-Sentry",
                text: "Trade chat data provided by www.nexus-stats.com"
            }

            // Show online status of Nexus-sentry on start
            message.reply(`Started tracking tradechat. Nexus-Sentry status: ${status["Chat-Sentry"].online ? "\`online\`" : "\`offline\`"}`)

            // Subscribe to API
            nexus.subscribe("/warframe/v1/requests")
            nexus.subscribe("/warframe/v1/game/updates")

            // Post on subscription updates
            nexus.on("/warframe/v1/requests", async req => {
                if (req.subMessage) {
                    let current = {}
                    let item = await nexus.get(`/warframe/v1/items/${req.item}`)
                    let url = `https://nexus-stats.com/${item.type}/${item.name.replace(" Prime", "").split(" ").join("%20")}`
                    current = {
                        user: req.user,
                        text: req.subMessage.replace(new RegExp( `(${req.item})`, "gi" ), `[${req.item}](${url})`)
                    }

                    // Text cleanup
                    current.text = current.text.split("platinum").join("").split("plat").join("")

                    // Find location of price value and show diff to median
                    let stats = await nexus.get(`/warframe/v1/items/${req.item}/statistics`)
                    let comp = null
                    stats.components.forEach(component => {
                        if (component.name === req.component) comp = component
                    })

                    let diff = req.price - comp.median
                    current.text = current.text.split(" ")
                    current.text.forEach((word, index) => {
                        if (word.includes(req.price)) {
                            current.text[index] = `**${req.price}p** (\` ${diff > 0 ? "+" + diff : diff}p\`)`
                        }
                    })
                    current.text = current.text.join(" ")

                    // Same user? Extend message
                    if (current.user === previous.user) {
                        current.text = previous.text + " " + current.text
                    }

                    // Different user? Post previously accumulated data
                    else {
                        message.embed(new RichEmbed().setDescription(previous.text).setAuthor(previous.user))
                    }

                    previous = current
                }
            })
            nexus.on("/warframe/v1/updates", () => {
                message.channel.sendMessage("Nexus-Sentry temporarily offline. Reason: Warframe requires updates.")
            })
        }
    }
}

module.exports = Track
