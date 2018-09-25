const Discord = require('discord.js-commando')
const fs = require('fs')
const token = fs.readFileSync('/run/secrets/nexus-bot-discord-token', 'utf-8').trim()
const bot = new Discord.Client({
  commandPrefix: ':',
  owner: '83598701120978944',
  disableEveryone: true
})

// Register Commands
bot.registry.registerDefaults()
  .registerGroups([['ingame', 'in-game bot data']])
  .registerCommandsIn(`${__dirname}/commands`)

// Login Process
bot.login(token)
bot.on('ready', () => {
  console.log('Connected successfully!')
  bot.user.setActivity('Trade Chat Simulator')
})

module.exports = bot
