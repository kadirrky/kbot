import privrooms_control from "../../utils/bot/privrooms_control.js"
export const data = {
    name: "odamod",
    description:"Oluşturduğunuz kanalda belirlediğin kişiyi Mod yapar.",
    cooldown: 30,
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
                    privroomcommands:"roomcommenddatamodadd",
                    privroomchannelid: channel.id,
                    privroomaddmodid: selectedMember
                }
            }
            if (interaction.type !== "DEFAULT" && interaction.isSelectMenu()) await interaction.deferUpdate();
            if (interaction.type !== "DEFAULT" && interaction.isApplicationCommand()) await interaction.deferReply({ephemeral: true});

            privrooms_control( command, interaction )
            
            await channel.permissionOverwrites.edit(selectedMember, {
                CONNECT: true,
                USE_SOUNDBOARD: true,
                STREAM: true,
                START_EMBEDDED_ACTIVITIES: true,
            })  

            if (interaction.type !== "DEFAULT" && interaction.deferred) await interaction.editReply({embeds: [embed(`Başarıyla <@${selectedMember}> kişisi kanalda Mod yapıldı.`,"GREEN","Kanalda Mod Yap")],components: [], ephemeral: true })
            const LogForChannel = await client.channels.fetch(process.env.roomlogchannel);
            await LogForChannel.send({ embeds: [ embed(`<@${member.id || interaction.member.id}> tarafından <@${selectedMember}> kişisi \`${channel.name}\` kanalında Mod yapıldı.`, "GREEN", `Kanalda Mod Yapıldı (${channel.id})`) ]})
    
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