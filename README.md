<br>

<p align="center">
<img src ="https://github.com/nexus-devs/nexus-stats/raw/development/.github/blobob.gif" height="100" />

<br>

<p align="center">Official <a href="https://nexushub.co">NexusHub</a> Discord Bot.</p>

##

[![build](https://ci.nexus-stats.com/api/badges/nexus-devs/nexus-bot/status.svg)](https://ci.nexus-stats.com/nexus-devs/nexus-bot)
[![Discord](https://img.shields.io/discord/195582152849620992.svg?logo=discord)](https://discord.gg/AG8RPZ8)

<br>

## Features
- Comprehensive price check for Warframe items and components
- Alerts when an item or component hits a certain price
- Live trade chat tracking

<br>

## Commands

### Price Commands
**Price Check**
- Command: `price-check  <item> [component]`, Aliases: `pc, pcheck`
- Description: Returns a comprehensive price check for an item or component.
- Throttling: 5 usages per 10 seconds

| Parameter      | Optional     | Descriptions     |
|:---------------|:-------------|:-----------------|
| item | `false` | The item to check. |
| component | `true` | The specific component to check. |

**Price Alert**
- Command: `price-alert  <item> [component] [order type] [threshold type] <price>`, Aliases: `alert, palert`
- Description: Sets an alert for an item or component. The bot messages you, when the price hits the set threshold.
- Throttling: 3 alerts per user

| Parameter      | Optional     | Descriptions     |
|:---------------|:-------------|:-----------------|
| item | `false` | The item to check. |
| component | `true` | The specific component to check. |
| order type | `true` | Has to be `buying` or `selling`. Specifies the order type to check for. Default is 'buying'
| threshold type | `true` | Has to be `below` or `above`. Specifies when the alert goes off. Default is 'below' if order type is 'buying', otherwise 'above'
| price | `false` | The price to go below or above to. |

**Price Alert List**
- Command: `price-alert-list [operation] [list item]`, Aliases: `alert-list, palert-list`
- Description: Lists all set alerts or performs an operation on them.

| Parameter      | Optional     | Descriptions     |
|:---------------|:-------------|:-----------------|
| operation | `true` | If not specified, it will just return the list. Otherwise it will perform the operation. Currently only supports `delete` |
| list item | `true` | If an operation is specified, this is the alert number in the list to perform the operation on. |

### Tradechat Commands
**Track Tradechat**
- Command: `track`
- Description: Starts tracking the tradechat in the current channel. Only works on a server.
- Permissions: `MANAGE_CHANNELS`
- Throttling: 1 channel per server

**Untrack Tradechat**
- Command: `untrack`
- Description: Stops tracking the tradechat in the current channel. Only works if the tradechat is currently getting tracked.
- Permissions: `MANAGE_CHANNELS`

<br>

## Quickstart
If you want to run this yourself for whatever reason, register a bot on [Discord](https://discordapp.com/developers/applications/me),
get [Docker](https://www.docker.com/) and run:

```
bash deploy.sh
```

<br>

## Docker secrets
Requires the following secrets:
- `nexus-bot-discord-token`
- `nexus-client-key` (in production)
- `nexus-client-secret` (in production)
- `mongo-admin-pwd` (in production)

<br>

## License
[CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/)
