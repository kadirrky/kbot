import fs from 'fs';
const modrole = process.env.modrole.split(",")
export const data = {
    name: "odamodpaneliplus",
    description:"Mod panelinde son işlevi görür.",
    cooldown: 10, 
    privroomcommands: "roomcommendmod",
    async execute(interaction, foundchannedid = "") {  
        if(interaction.type === "DEFAULT") return
        const { embed } = interaction.client
        let { client, channel, member } = interaction   
        
        await interaction.deferUpdate();
        let insertmod = interaction.message.content || ""
        const SelectedUserId = `${interaction.values}`
        const usercontrol = client.users.cache.get(SelectedUserId);
        if (!usercontrol && interaction.deferred) return interaction.editReply({ embeds: [ embed(`Bu kişiye işlem yapılamıyor.`,"RED",) ], components: [],ephemeral: true })
        
        //Moderator Controll
        const usercont = await interaction.guild.members.fetch(SelectedUserId);      
        if (usercont && (usercont.roles.cache.has(modrole[0]) || usercont.roles.cache.has(modrole[1])) && interaction.deferred) {
            await interaction.editReply({ embeds: [ embed(`Moderasyon ekibinden bir kişiye işlem yapamzsınız.`, "RED") ], components: [],ephemeral: true})
            return
        }

        // RoomOwnerGuard Control   
        let foundchannedownerid
        const dataControl = fs.readFileSync('./database/roomsdata.json', 'utf8');
        if (dataControl){
            const json = JSON.parse(dataControl);
            if (json) foundchannedownerid = `${json[channel.id].channeladmin}`
        }
        if(foundchannedownerid === SelectedUserId && interaction.deferred){
            await interaction.editReply({ embeds: [ embed(`\`${channel.name}\` kanalının sahibi <@${foundchannedownerid}> olduğu için işlem yapamazsınız.`, "RED") ], components: [],ephemeral: true })
            return
        }         
        
        
        try {

            if(insertmod === "odaat"){
                const usersinthechannel = [];
                channel.members.forEach(member => {
                    usersinthechannel.push(member.user.id);
                }); 
                if(!usersinthechannel.includes(SelectedUserId)) return
                usercontrol.voice.disconnect()        
            }
            else if(insertmod === "blacklist"){            
                await channel.permissionOverwrites.edit(SelectedUserId, {
                    CONNECT: false
                })
                const LogForChannel = await client.channels.fetch(process.env.roomlogchannel);
                await LogForChannel.send({ embeds: [ embed(`<@${member.id || interaction.member.id}> tarafından <@${SelectedUserId}> kişisi <#${channel.id}> kanalında \`blacklist\` eklendi.`, "BLACK", `Blacklist Eklendi (${channel.id})`) ] })
                if (interaction.deferred) interaction.editReply({ embeds: [ embed(`Başarıyla <@${SelectedUserId}> kişinini \`${channel.name}\` kanalında \`Blacklist\` eklediniz.`, "BLACK", `Blacklist Eklendi`) ], components: [],ephemeral: true })
            }
            else if(insertmod === "whitelist"){            
                await channel.permissionOverwrites.edit(SelectedUserId, {
                    CONNECT: true
                })
                const LogForChannel = await client.channels.fetch(process.env.roomlogchannel);
                await LogForChannel.send({ embeds: [ embed(`<@${member.id || interaction.member.id}> tarafından <@${SelectedUserId}> kişisi <#${channel.id}> kanalında \`whitelist\` eklendi.`, "WHITE", `Whitelist Eklendi (${channel.id})`) ] })
                if (interaction.deferred) interaction.editReply({ embeds: [ embed(`Başarıyla <@${SelectedUserId}> kişinini \`${channel.name}\` kanalında \`whitelist\` eklediniz.`, "WHITE", `Whitelist Eklendi`) ], components: [],ephemeral: true })
            }
            else if(insertmod === "odasespizin"){            
                await channel.permissionOverwrites.edit(SelectedUserId, {
                    SPEAK: true
                })
                const LogForChannel = await client.channels.fetch(process.env.roomlogchannel);
                await LogForChannel.send({ embeds: [ embed(`<@${member.id || interaction.member.id}> tarafından <@${SelectedUserId}> kişisinin <#${channel.id}> kanalında ses paneli izni açıldı.`, "YELLOW", `Kanalda Ses Paneli İzni Açıldı (${channel.id})`) ] })       
                if (interaction.deferred) interaction.editReply({ embeds: [ embed(`Başarıyla <@${SelectedUserId}> kişinin ses paneli iznini açtınız. Tekrar kanala bağlandığında ses paneli izni olacaktır.`, "YELLOW", `Kanalda Ses Paneli İzni Açıldı`) ], components: [],ephemeral: true })
            }
            else if(insertmod === "odasespengel"){            
                await channel.permissionOverwrites.edit(SelectedUserId, {
                    SPEAK: false
                })
                const LogForChannel = await client.channels.fetch(process.env.roomlogchannel);
                await LogForChannel.send({ embeds: [ embed(`<@${member.id || interaction.member.id}> tarafından <@${SelectedUserId}> kişisinin <#${channel.id}> kanalında ses paneli engellendi.`, "BLUE", `Kanalda Ses Paneli Engellendi (${channel.id})`) ] })       
                if (interaction.deferred) interaction.editReply({ embeds: [ embed(`Başarıyla <@${SelectedUserId}> kişinin ses panelini engellediniz. Tekrar kanala bağlandığında ses paneli engeli olacaktır.`, "BLUE", `Kanalda Ses Paneli Engellendi`) ], components: [],ephemeral: true })
            }
            else if(insertmod === "odayayinizin"){      
                await channel.permissionOverwrites.edit(SelectedUserId, {
                    STREAM: true
                })
                const LogForChannel = await client.channels.fetch(process.env.roomlogchannel);
                await LogForChannel.send({ embeds: [ embed(`<@${member.id || interaction.member.id}> tarafından <@${SelectedUserId}> kişisinin <#${channel.id}> kanalında yayın izni verildi.`, "YELLOW", `Kanalda Yayın İzni Verildi (${channel.id})`) ] })       
                if (interaction.deferred) interaction.editReply({ embeds: [ embed(`Başarıyla <@${SelectedUserId}> kişine yayın izni verildi.`, "YELLOW", `Kanalda Yayın İzni Verildi`) ], components: [],ephemeral: true })
            }
            else if(insertmod === "odayayinengel"){      
                await channel.permissionOverwrites.edit(SelectedUserId, {
                    STREAM: false
                })
                const LogForChannel = await client.channels.fetch(process.env.roomlogchannel);
                await LogForChannel.send({ embeds: [ embed(`<@${member.id || interaction.member.id}> tarafından <@${SelectedUserId}> kişisinin <#${channel.id}> kanalında yayın izni engellendi.`, "BLUE", `Kanalda Yayın İzni Engellendi (${channel.id})`) ] })       
                if (interaction.deferred) interaction.editReply({ embeds: [ embed(`Başarıyla <@${SelectedUserId}> kişisinin yayın izni engellendi.`, "BLUE", `Kanalda Yayın İzni Engellendi`) ], components: [],ephemeral: true })
            }
            else if(insertmod === "odaetkizin"){      
                await channel.permissionOverwrites.edit(SelectedUserId, {
                    START_EMBEDDED_ACTIVITIES: true
                })
                const LogForChannel = await client.channels.fetch(process.env.roomlogchannel);
                await LogForChannel.send({ embeds: [ embed(`<@${member.id || interaction.member.id}> tarafından <@${SelectedUserId}> kişisinin <#${channel.id}> kanalında etkinlik izni verildi.`, "YELLOW", `Kanalda Etkinlik İzni Verildi (${channel.id})`) ] })       
                if (interaction.deferred) interaction.editReply({ embeds: [ embed(`Başarıyla <@${SelectedUserId}> kişine etkinlik izni verildi.`, "YELLOW", `Kanalda Etkinlik İzni Verildi`) ], components: [],ephemeral: true })
            }
            else if(insertmod === "odaetkengel"){      
                await channel.permissionOverwrites.edit(SelectedUserId, {
                    START_EMBEDDED_ACTIVITIES: false
                })
                const LogForChannel = await client.channels.fetch(process.env.roomlogchannel);
                await LogForChannel.send({ embeds: [ embed(`<@${member.id || interaction.member.id}> tarafından <@${SelectedUserId}> kişisinin <#${channel.id}> kanalında etkinlik izni engellendi.`, "BLUE", `Kanalda Etkinlik İzni Engellendi (${channel.id})`) ] })       
                if (interaction.deferred) interaction.editReply({ embeds: [ embed(`Başarıyla <@${SelectedUserId}> kişisinin etkinlik izni engellendi.`, "BLUE", `Kanalda Etkinlik İzni Engellendi`) ], components: [],ephemeral: true })
            
            }
        } catch (error) {
            if (interaction.deferred) interaction.editReply({ embeds: [ embed(`Bu komut \`${data.name}\` kullanılırken hata oluştu.`,"RED",) ], components: [], components: [], ephemeral: true })
            console.error(error)
        }


    }
}