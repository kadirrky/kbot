import { MessageEmbed } from "discord.js"

export const data = {
    name: "ping",
    description:"Botun ve discord'un gecikmesini gönderir.",
    cooldown: 10,    
    execute(interaction) {
        const discord_ping = interaction.client.ws.ping
        const bot_ping = Math.abs(Date.now() - interaction.createdTimestamp)

        const response = new MessageEmbed()
        .setColor("WHITE")
        .addFields(
            {name:"Discord Gecikmesi", value: `${discord_ping} ms`, inline: true},
            {name:"Bot Gecikmesi", value: `${bot_ping} ms`, inline: true},
        )
        interaction.reply({embeds:[response]})
    }
}

export const slash_data = {
    name: data.name,
    description: data.description
}