const Commando = require('discord.js-commando')
const path = require('path')
const secret = require('./secret.js')

const client = new Commando.Client({
  commandPrefix: 'nex',
  owner: '104959162819072000'
})

client.registry
  .registerDefaults()
  .registerGroup('prices', 'Item Prices')
  .registerGroup('tradechat', 'Trade Chat')
  .registerCommandsIn(path.join(__dirname, 'commands'))

client.on('ready', () => {
  console.log('Bot ready!')
  client.user.setActivity('NexusHub.co')
})

client.login(secret.token)
