import privrooms_control from "../../utils/bot/privrooms_control.js"
import privrooms_panelupdate from "../../utils/bot/privrooms_panelupdate.js"
export const data = {
    name: "odasil",
    description:"Oluşturduğunuz kanalı siler.",
    cooldown: 5,
    privroomcommands: "roomcommendadmin",
    async execute(interaction, foundchannedid = "") {  
        
        const { client, member } = interaction
        let { channel } = interaction
        const { embed } = interaction.client
        let command = {
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
            if(interaction.type !== "DEFAULT" && !channel.isVoice()) return interaction.reply({ embeds: [ embed(`Bu kanalı \`Ses Kanalı\` olmadığı için silemezsiniz.`,"RED",) ], ephemeral: true  })
            if(interaction.type !== "DEFAULT" && !channel.name.startsWith('Top Secret')) return interaction.reply({ embeds: [ embed(`Bu kanalı \`Geçici Kanal\` olmadığı için silemezsiniz.`,"RED",) ], ephemeral: true  })
            if(!channel) {
                command = {
                    data:{
                        privroomcommands:"roomcommenddatadel",
                        privroomchannelid: channel.id
                    }
                }
                privrooms_control( command, interaction )
                return
            }

            await channel.delete()
            .then(async channel  => {
                command = {
                    data:{
                        privroomcommands:"roomcommenddatadel",
                        privroomchannelid: channel.id
                    }
                }
                privrooms_control( command, interaction )
                const LogForChannel = await client.channels.fetch(process.env.roomlogchannel);
                await LogForChannel.send({ embeds: [ embed(`<@${member.id || interaction.member.id}> tarafından \`${channel.name}\` kanalı silindi.`, "RED", `Kanal Silindi (${channel.id})`) ] })
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