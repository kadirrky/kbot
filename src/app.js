import { Client, Collection } from "discord.js"
import { readdirSync } from "fs"
import 'dotenv/config'
const client = new Client({
    intents:["GUILDS", "GUILD_MESSAGES", "GUILD_MEMBERS", "GUILD_PRESENCES", "GUILD_MESSAGE_REACTIONS", "GUILD_VOICE_STATES"],
    //presence:{ status:"dnd", activities: [{name: "K Bot", type:"LISTENING"}] }
})

// Assigments
client.commands = new Collection()
client.embed = await import("./utils/bot/embed.js").then(m => m.default)

// Event Loader
readdirSync("./events").forEach(async file => {
    const event = await import(`./events/${file}`).then(m => m.default)
    event(client)
})

// Command Loader
client.commands = new Collection()
readdirSync("./commands").forEach(category =>{
    readdirSync(`./commands/${category}`).forEach(async file => {
        const command = await import(`./commands/${category}/${file}`)
        client.commands.set(command.data.name, command)
    })
})

client.login(process.env.token);