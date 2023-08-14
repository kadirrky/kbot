import privrooms_control from "../../utils/bot/privrooms_control.js"
import privrooms_panelupdate from "../../utils/bot/privrooms_panelupdate.js"
export const data = {
    name: "odaetkac",
    description:"Oluşturduğunuz kanalda kullanıcılara etkinlik iznini açar.",
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
            if(interaction.type !== "DEFAULT" && !interaction.isButton() && foundchannedid === "") return privrooms_control( command, interaction )
            if(interaction.type !== "DEFAULT" && !interaction.isButton() && foundchannedid !== "") {             
                channel = await client.channels.fetch(foundchannedid);
            }        
            if(interaction.type !== "DEFAULT") interaction.deferReply({ ephemeral:true })
            await channel.permissionOverwrites.edit(interaction.guild.roles.cache.get(process.env.roommemberrole), {
                START_EMBEDDED_ACTIVITIES: true
            })
            .then(async channel  => {
                const LogForChannel = await client.channels.fetch(process.env.roomlogchannel);
                await LogForChannel.send({ embeds: [ embed(`<@${member.id || interaction.member.id}> tarafından <#${channel.id}> kanalında kullanıcılara etkinlik izni açıldı.`, "YELLOW", `Kanalda Etkinlik İzni Açıldı (${channel.id})`) ] })
                if(interaction.type !== "DEFAULT" && interaction.deferred){            
                    interaction.editReply({ embeds: [ embed(`Başarıyla \`${channel.name}\` kanalında kullanıcılara etkinlik iznini açtınız.`, "YELLOW", `Kanalda Etkinlik İzni Açıldı`) ], ephemeral: true })
                }  
                if(interaction.type !== "DEFAULT" && interaction.isButton()) privrooms_panelupdate(interaction)
            })
        } catch (error) {
            console.error(error)
            interaction.reply({ embeds: [ embed(`Bu komut \`${data.name}\` kullanılırken hata oluştu.`,"RED",) ], ephemeral: true })
        }

        
    }
}

export const slash_data = {
    name: data.name,
    description: data.description
}