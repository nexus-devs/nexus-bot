const Commando = require('discord.js-commando')
const path = require('path')
const config = require('./secret.js')

const client = new Commando.Client({
  commandPrefix: 'nex',
  owner: '104959162819072000'
})

client.registry
  .registerDefaults()
  .registerGroup('prices', 'Item Prices')
  .registerCommandsIn(path.join(__dirname, 'commands'))

client.on('ready', () => {
  console.log('Bot ready!')
})

client.login(config.token)
