import privrooms_control from "../../utils/bot/privrooms_control.js"
import fs from 'fs';

export const data = {
    name: "odadevret",
    description:"Oluşturduğunuz kanalda belirlediğin kişiyi Mod yapar.",
    cooldown: 60,
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
            let selectedMember = ""
            if (interaction.type !== "DEFAULT" && interaction.isSelectMenu()) selectedMember = `${interaction.values}`
            if (interaction.type !== "DEFAULT" && interaction.isApplicationCommand()) selectedMember = interaction.options?._hoistedOptions?.[0]?.user?.id || "000"
            if (interaction.type === "DEFAULT"){
                selectedMember = interaction.mentions.users.first() || `${interaction.content.slice(process.env.prefix.length+(data.name).length).trim().split(/ +/)}`
                if(selectedMember.id) selectedMember = selectedMember.id
                if(!(selectedMember.id) && !(client.users.cache.get(selectedMember))) return interaction.channel.send({ embeds: [ embed(`Bu \`${selectedMember}\` id'de kullanıcı bulunamadı.`, "RED", `Kanalda Mod Yapıamadı (${channel.id})`) ]})
            } 

            command = {
                data:{
                    privroomcommands:"roomcommenddataadminedit",
                    privroomchannelid: channel.id,
                    privroomeditownerid: selectedMember
                }
            }
            if (interaction.type !== "DEFAULT" && interaction.isSelectMenu()) await interaction.deferUpdate();
            if (interaction.type !== "DEFAULT" && interaction.isApplicationCommand()) await interaction.deferReply({ephemeral: true});
            if(interaction.member.id === selectedMember) return await interaction.editReply({embeds: [embed(`Kendiniz harici başka birini seçiniz.`,"#2effe9","Kanal Devredilemdi")],components: [], ephemeral: true })


            let datacontrols = "hayir"
            let datakey = "hayir"
            const datasql = fs.readFileSync("./database/roomsdata.json", 'utf8');
            const jsonData = JSON.parse(datasql);
            for (const key in jsonData) {
                if (jsonData.hasOwnProperty(key)) {
                    const channelAdminId = jsonData[key].channeladmin;
                    if (channelAdminId === selectedMember) {
                        datacontrols = "evet"
                        datakey = key
                    }
                }
            }

            if(datacontrols === "evet") return await interaction.editReply({embeds: [embed(`Zaten bu kullanıcı <#${datakey}> kanalının sahibi.`,"#2effe9","Kanal Devredilemdi")],components: [], ephemeral: true })

            privrooms_control( command, interaction )

            
            await channel.permissionOverwrites.delete(interaction.member.id)      

            await channel.permissionOverwrites.edit(selectedMember, {
                CONNECT: true,
                USE_SOUNDBOARD: true,
                STREAM: true,
                START_EMBEDDED_ACTIVITIES: true,
            })  

            if (interaction.type !== "DEFAULT") await interaction.editReply({embeds: [embed(`Başarıyla <@${selectedMember}> kişisi kanalın yeni sahibi yapıldı.`,"#2effe9","Kanal Devredildi")],components: [], ephemeral: true })
            const LogForChannel = await client.channels.fetch(process.env.roomlogchannel);
            await LogForChannel.send({ embeds: [ embed(`<@${member.id || interaction.member.id}> tarafından <@${selectedMember}> kişisi \`${channel.name}\` kanalının yeni sahibi yapıldı.`, "#2effe9", `Kanal Devredildi (${channel.id})`) ]})

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
            name: "kullanıcı",
            description: "Lütfen kullanıcıyı girin",
            type: 6,
            required: true
        }
    ]
}