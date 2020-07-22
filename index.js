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
    console.log('REACTION')
    if (reaction.partial) {
        try {
            await reaction.fetch()
        } catch (error) {
            console.log('Something went wrong when fetching reaction: ', error)
            return
        }
    }
    console.log('FETCHED')

    // if (reaction.message.channel.name !== config.roleChannel) return
    console.log(reaction.emoji)
})

// Channel based auto role assignment
client.on('message', async (message) => {
    for (const autoRole of config.channelRoleAssignments) {
        if (autoRole.channel !== message.channel.name) continue

        const role = message.guild.roles.find(r => r.name === autoRole.role)
        message.member.addRole(role)
    }
})