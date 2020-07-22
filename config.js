const fs = require('fs')
const prod = process.env.NODE_ENV === 'production'

const config = {

  /**
   * Bot or Discord specific settings
   */
  discordToken: fs.readFileSync('/run/secrets/nexus-bot-discord-token', 'utf-8').trim(),
  embedColor: '#11acb2',
  commandPrefix: '!',

  /**
   * Nexus client settings
   */
  apiUrl: 'wss://api.nexushub.co/ws',
  authUrl: 'wss://auth.nexushub.co/ws',
  userKey: prod ? fs.readFileSync('./run/secrets/nexus-cubic-key', 'utf-8').trim() : undefined,
  userSecret: prod ? fs.readFileSync('./run/secrets/nexus-cubic-secret', 'utf-8').trim() : undefined,

  /**
   * Database settings
   */
  mongoUrl: prod ? 'mongodb://mongo:27017/' : 'mongodb://localhost/', // This is the default if you run it with docker
  mongoDb: 'nexus-bot',

  /**
   * Price alert settings
   * Will probably have to go in a dynamic system with roles later
   */
  maxAlerts: 3,

  /**
   * Trade chat tracking settings
   * Will probably have to go in a dynamic system with roles later
   * Flags: https://discord.js.org/#/docs/main/stable/class/Permissions?scrollTo=s-FLAGS
   */
  trackingPermission: 'MANAGE_CHANNELS', // Permission needed to start tracking trade chat
  maxTrackingsPerServer: 1,

  /**
   * Channel based role assignment
   */
  channelRoleAssignments: [
    { channel: 'wow', role: 'TestRole' }
  ]

}

module.exports = config
