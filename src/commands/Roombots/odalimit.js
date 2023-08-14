import { Message } from "discord.js"
import privrooms_control from "../../utils/bot/privrooms_control.js"
import privrooms_panelupdate from "../../utils/bot/privrooms_panelupdate.js"
export const data = {
    name: "odalimit",
    description:"Oluşturduğunuz kanalın limitini değiştirir.",
    cooldown: 5,
    privroomcommands: "roomcommendmod",
    async execute(interaction, foundchannedid = "") {  
        
        const { client, member } = interaction
        let { channel } = interaction
        const { embed } = interaction.client
        const command = {
            data:{
                name: data.name,
                privroomcommands: data.privroomcommands,
                privroomcommandsfound:"roomcommendfound"
            }
        }
        
        try { 
            // Message Control
            if (interaction.type === "DEFAULT" && foundchannedid === "") return privrooms_control( command, interaction )        
            if (interaction.type === "DEFAULT" && foundchannedid !== "") {             
                channel = await client.channels.fetch(foundchannedid);
            }

            // noButton Control
            if(interaction.type !== "DEFAULT" && !interaction.isSelectMenu() && foundchannedid === "") return privrooms_control( command, interaction )
            if(interaction.type !== "DEFAULT" && !interaction.isSelectMenu() && foundchannedid !== "") {             
                channel = await client.channels.fetch(foundchannedid);
            }        
            if(interaction.type !== "DEFAULT") interaction.deferReply({ ephemeral:true })
            let limit = "25"
            let lastlimit = ""
            if (interaction.type !== "DEFAULT" && interaction.isSelectMenu()) limit = `${interaction.values}`
            if (interaction.type !== "DEFAULT" && interaction.isApplicationCommand()) limit = interaction.options.getInteger("limit") 
            if (interaction.type === "DEFAULT") limit = `${interaction.content.slice(process.env.prefix.length+(data.name).length).trim().split(/ +/)}`
            if (isNaN(limit) || limit === "") limit = 25
            
            if (parseInt(limit) <= 2){
                limit = 2     
                lastlimit = "(min)"       
            }
            if (parseInt(limit) >= 25){            
                limit = 25
                lastlimit = "(max)"  
            }
            await channel.edit({
                userLimit: limit
            })
            .then(async channel  => {
                const LogForChannel = await client.channels.fetch(process.env.roomlogchannel);
                await LogForChannel.send({ embeds: [ embed(`<@${member.id || interaction.member.id}> tarafından <#${channel.id}> kanalının limiti \`${limit}${lastlimit}\` olarak ayarlandı.`, "ORANGE", `Kanal Limiti Değişti (${channel.id})`) ] })
                if(interaction.type !== "DEFAULT" && interaction.deferred){
                    interaction.editReply({ embeds: [ embed(`Başarıyla \`${channel.name}\` kanalının limitini \`${limit}${lastlimit}\` olarak ayarladınız.`, "ORANGE", `Kanal Limiti Değişti`) ], ephemeral: true })
                }
                if(interaction.type !== "DEFAULT" && interaction.isSelectMenu()) privrooms_panelupdate(interaction)
            })
    
    } catch (error) {
        console.error(error)
        interaction.reply({ embeds: [ embed(`Bu komut \`${data.name}\` kullanılırken hata oluştu.`,"RED",) ], ephemeral: true })
    }

        
    }
}

export const slash_data = {
    name: data.name,
    description: data.description,
    options: [
        {
            name: "limit",
            description: "İstediğiniz limiti girin.",
            type: 4,
            required: true,
        }
    ]
}
