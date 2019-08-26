const Commando = require('discord.js-commando')
const path = require('path')
const config = require('./config.js')

const client = new Commando.Client({
  commandPrefix: config.commandPrefix,
  owner: '104959162819072000'
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
