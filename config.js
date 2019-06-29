module.exports = {

  /**
   * Nexus client settings
   * TODO: Admin client with discord.js throttling
   */
  api_url: 'wss://api.nexushub.co/ws',
  auth_url: 'wss://auth.nexushub.co/ws',

  /**
   * Database settings
   */
  mongoUrl: 'mongodb://localhost/',
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
  trackingPermission: 'MANAGE_CHANNELS' // Permission needed to start tracking trade chat

}
