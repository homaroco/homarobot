import tmi from 'tmi.js'
import { Client, Events, GatewayIntentBits } from 'discord.js'
import dotenv from 'dotenv'

dotenv.config()

const discordClient = new Client({ intents: [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.MessageContent,
] })

discordClient.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`)
})

discordClient.login(process.env.DISCORD_TOKEN)

discordClient.on(Events.MessageCreate, msg => {
  if(msg.author.bot) return
  const name = msg.author.globalName ? msg.author.globalName : msg.author.username
  twitchClient.say(`#${process.env.TWITCH_CHANNEL}`, `${name}: ${msg.content}`)
})

const opts = {
  identity: {
    username: 'homarobot',
    password: process.env.TWITCH_TOKEN,
  },
  channels: [
    process.env.TWITCH_CHANNEL,
  ]
}

const twitchClient = new tmi.client(opts)
twitchClient.connect()

twitchClient.on('message', onMessageHandler)
twitchClient.on('connected', onConnectedHandler)

function onMessageHandler (target, context, msg, self) {
  if (self) return
  discordClient.channels
    .fetch(process.env.DISCORD_CHANNEL)
    .then(channel => channel.send(`${context.username}: ${msg.trim()}`))
}

function onConnectedHandler (addr, port) {
  console.log(`Connected to ${addr}:${port}`)
}