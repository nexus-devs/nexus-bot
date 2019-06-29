const Commando = require('discord.js-commando').Command
const MongoClient = require('mongodb').MongoClient
const Nexus = require('../../cubic/packages/client')
const nexusConfig = require('../config.js')

// Declare here so we share the same instance in all commands
// TODO: Admin permissions and throttling in the commands
const nexus = new Nexus({
  api_url: nexusConfig.api_url,
  auth_url: nexusConfig.auth_url
})

class Command extends Commando {
  constructor (client, config) {
    super(client, config)
    this.api = nexus
    this.db = MongoClient.connect(nexusConfig.mongoUrl)
    this.itemList = undefined
  }

  // converts name to first letter upper-case, everything else lower-case
  convertName (str) { return str.toLowerCase().replace(/\b\w/g, l => l.toUpperCase()) }

  // Find out matching item and component from a string
  async parseItemAndComponent (argument) {
    if (!this.itemList) this.itemList = await this.api.get('/warframe/v1/items?tradable=true')

    const result = {}
    let meta
    for (let item of this.itemList) {
      const lookupName = argument.split(' ')
      const itemName = item.name.split(' ')

      let component
      if (itemName.length !== lookupName.length) component = lookupName.pop()
      if (itemName.join() === lookupName.join()) {
        result['item-name'] = item.name
        result['component-name'] = component
        meta = item
        break
      }
    }

    return { args: result, meta }
  }
}

module.exports = Command
