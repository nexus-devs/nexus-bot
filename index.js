const Commando = require('discord.js-commando')
const path = require('path')
const config = require('./secret.js')

const client = new Commando.Client({
  commandPrefix: 'nex',
  owner: '104959162819072000'
})

client.registry
  .registerDefaults()
  .registerGroup('test-group', 'Test Group')
  .registerCommandsIn(path.join(__dirname, 'commands'))

console.log('bot registered shit')

client.login(config.token)

console.log('bot logged in')
