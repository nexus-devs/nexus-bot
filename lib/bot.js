const Discord = require('discord.js-commando')
const bot = new Discord.Client({
  commandPrefix: '@NexusBot#3547',
  owner: '83598701120978944',
  disableEveryone: true
})

// Register Commands
bot.registry.registerDefaults()
  .registerGroups([['ingame', 'in-game bot data']])
  .registerCommandsIn(`${__dirname}/commands`)

// Login Process
bot.login(process.env.NEXUS_BOT_TOKEN)
bot.on('ready', () => {
  console.log('Connected successfully!')
  bot.user.setGame('Trade Chat Simulator')
})

module.exports = bot
