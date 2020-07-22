const Commando = require('discord.js-commando')
const path = require('path')
const config = require('./config.js')

const client = new Commando.Client({
  commandPrefix: config.commandPrefix,
  owner: '104959162819072000',
  partials: ['MESSAGE', 'CHANNEL', 'REACTION']
})

client.registry
  .registerDefaultTypes()
  .registerDefaultGroups()
  .registerDefaultCommands({
    help: true,
    prefix: false,
    ping: false,
    eval_: false,
    unknownCommand: true,
    commandState: false
  })
  .registerGroup('prices', 'Item Prices')
  .registerGroup('tradechat', 'Trade Chat')
  .registerCommandsIn(path.join(__dirname, 'commands'))

client
  .on('ready', () => {
    console.log('Bot ready!')
    client.user.setActivity('NexusHub.co')
  })
  .on('error', console.error)
  .on('warn', console.warn)
  .on('debug', console.log)

client.login(config.discordToken)

// Manual reaction based role assignment
client.on('messageReactionAdd', async (reaction, user) => {
    if (reaction.partial) {
        try {
            await reaction.fetch()
        } catch (error) {
            console.log('Something went wrong when fetching reaction: ', error)
            return
        }
    }

    if (reaction.message.channel.name !== config.roleChannel) return

    for (const reactionRole of config.roleReactions) {
        if (reaction.emoji.name !== reactionRole.reaction) continue

        const guild = reaction.message.guild
        const role = guild.roles.cache.find(r => r.name === reactionRole.role)
        await guild.members.cache.find(m => m.id === user.id).roles.add(role)
    }
})

// Channel based auto role assignment
client.on('message', async (message) => {
    for (const autoRole of config.channelRoleAssignments) {
        if (autoRole.channel !== message.channel.name) continue

        const role = message.guild.roles.cache.find(r => r.name === autoRole.role)
        await message.member.roles.add(role)
    }
})