import privrooms_control from "../../utils/bot/privrooms_control.js"
export const data = {
    name: "odam",
    description:"Oluşturduğunuz kanalda belirlediğin kişiye işlem yapar.",
    cooldown: 5,
    privroomcommands: "roomcommendadmin",
    priroomguard: "owner",
    async execute(interaction, foundchannedid = "", foundchannedownerid = "") {  
        const modrole = process.env.modrole.split(",")
        
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
        let selectedProcess
        if (interaction.type !== "DEFAULT" && interaction.isApplicationCommand()) selectedProcess = interaction.options?._hoistedOptions?.[0]?.value || ""
        let selectedMember = ""
        if (interaction.type !== "DEFAULT" && interaction.isApplicationCommand()) selectedMember = interaction.options?._hoistedOptions?.[1]?.user?.id || "000"
        if (interaction.type === "DEFAULT"){
            const selectedProcessv2 = interaction.content.slice(process.env.prefix.length+(data.name).length).trim().split(/ +/) || "und und"
            if (!selectedProcessv2[0] || selectedProcessv2[2]) return interaction.channel.send({ embeds: [ embed(`Bu komutu hatalı şekilde girdiniz.\n\`${process.env.prefix}${data.name} işlem @kullanıcı\``,"RED",) ] })
            selectedProcess = selectedProcessv2[0]
            selectedMember = interaction.mentions.users.first() || `${selectedProcessv2[1]}`
            if(selectedMember.id) selectedMember = selectedMember.id
            if(!(selectedMember.id) && !(client.users.cache.get(selectedMember))) return interaction.channel.send({ embeds: [ embed(`Bu \`${selectedMember}\` id'de kullanıcı bulunamadı.`, "RED") ]})
        } 
        
        if(interaction.type !== "DEFAULT") await interaction.deferReply({ ephemeral:true })
        const SelectedUserId = `${selectedMember}`
        const usercontrol = client.users.cache.get(SelectedUserId);

        //Moderator Controll
        const usercont = await interaction.guild.members.fetch(SelectedUserId);      
        if (usercont && (usercont.roles.cache.has(modrole[0]) || usercont.roles.cache.has(modrole[1]))) {
            await interaction.channel.send({ embeds: [ embed(`Moderasyon ekibinden bir kişiye işlem yapamzsınız.`, "RED") ]})
            return
        }
        
        // RoomOwnerGuard Control        
        if(interaction.type === "DEFAULT" && foundchannedownerid === selectedMember){
            await interaction.channel.send({ embeds: [ embed(`\`${channel.name}\` kanalının sahibi <@${foundchannedownerid}> olduğu için işlem yapamzsınız.`, "RED") ]})
             return
         } 
        if(interaction.type !== "DEFAULT" && foundchannedownerid === selectedMember && interaction.deferred){
           await interaction.editReply({ embeds: [ embed(`\`${channel.name}\` kanalının sahibi <@${foundchannedownerid}> olduğu için işlem yapamzsınız.`, "RED") ], components: [],ephemeral: true })
            return
        } 
        if (!usercontrol && interaction.deferred) return interaction.editReply({ embeds: [ embed(`Bu kişiye işlem yapılamıyor.`,"RED",) ], components: [],ephemeral: true })
        try {

            if(selectedProcess === "odaat"){
                const usersinthechannel = [];
                channel.members.forEach(member => {
                    usersinthechannel.push(member.user.id);
                }); 
                if(!usersinthechannel.includes(SelectedUserId)) return
                usercontrol.voice.disconnect()        
            }
            else if(selectedProcess === "blacklist"){            
                await channel.permissionOverwrites.edit(SelectedUserId, {
                    CONNECT: false
                })
                const LogForChannel = await client.channels.fetch(process.env.roomlogchannel);
                await LogForChannel.send({ embeds: [ embed(`<@${member.id || interaction.member.id}> tarafından <@${SelectedUserId}> kişisi <#${channel.id}> kanalında \`blacklist\` eklendi.`, "BLACK", `Blacklist Eklendi (${channel.id})`) ] })
                if(interaction.type !== "DEFAULT" && interaction.deferred) interaction.editReply({ embeds: [ embed(`Başarıyla <@${SelectedUserId}> kişinini \`${channel.name}\` kanalında \`Blacklist\` eklediniz.`, "BLACK", `Blacklist Eklendi`) ], components: [],ephemeral: true })
            }
            else if(selectedProcess === "whitelist"){            
                await channel.permissionOverwrites.edit(SelectedUserId, {
                    CONNECT: true
                })
                const LogForChannel = await client.channels.fetch(process.env.roomlogchannel);
                await LogForChannel.send({ embeds: [ embed(`<@${member.id || interaction.member.id}> tarafından <@${SelectedUserId}> kişisi <#${channel.id}> kanalında \`whitelist\` eklendi.`, "WHITE", `Whitelist Eklendi (${channel.id})`) ] })
                if(interaction.type !== "DEFAULT" && interaction.deferred) interaction.editReply({ embeds: [ embed(`Başarıyla <@${SelectedUserId}> kişinini \`${channel.name}\` kanalında \`whitelist\` eklediniz.`, "WHITE", `Whitelist Eklendi`) ], components: [],ephemeral: true })
            }
            else if(selectedProcess === "odasespizin"){            
                await channel.permissionOverwrites.edit(SelectedUserId, {
                    USE_SOUNDBOARD: true
                })
                const LogForChannel = await client.channels.fetch(process.env.roomlogchannel);
                await LogForChannel.send({ embeds: [ embed(`<@${member.id || interaction.member.id}> tarafından <@${SelectedUserId}> kişisinin <#${channel.id}> kanalında ses paneli izni açıldı.`, "YELLOW", `Kanalda Ses Paneli İzni Açıldı (${channel.id})`) ] })       
                if(interaction.type !== "DEFAULT" && interaction.deferred) interaction.editReply({ embeds: [ embed(`Başarıyla <@${SelectedUserId}> kişinin ses panel iznini açtınız. `, "YELLOW", `Kanalda Ses Paneli İzni Açıldı`) ], components: [],ephemeral: true })
            }
            else if(selectedProcess === "odasespengel"){            
                await channel.permissionOverwrites.edit(SelectedUserId, {
                    USE_SOUNDBOARD: false
                })
                const LogForChannel = await client.channels.fetch(process.env.roomlogchannel);
                await LogForChannel.send({ embeds: [ embed(`<@${member.id || interaction.member.id}> tarafından <@${SelectedUserId}> kişisinin <#${channel.id}> kanalında ses paneli engellendi.`, "BLUE", `Kanalda Ses Paneli Engellendi (${channel.id})`) ] })       
                if(interaction.type !== "DEFAULT" && interaction.deferred) interaction.editReply({ embeds: [ embed(`Başarıyla <@${SelectedUserId}> kişinin ses panelini engellediniz. `, "BLUE", `Kanalda Ses Paneli Engellendi`) ], components: [],ephemeral: true })
            }
            else if(selectedProcess === "odayayinizin"){      
                await channel.permissionOverwrites.edit(SelectedUserId, {
                    STREAM: true
                })
                const LogForChannel = await client.channels.fetch(process.env.roomlogchannel);
                await LogForChannel.send({ embeds: [ embed(`<@${member.id || interaction.member.id}> tarafından <@${SelectedUserId}> kişisinin <#${channel.id}> kanalında yayın izni verildi.`, "YELLOW", `Kanalda Yayın İzni Verildi (${channel.id})`) ] })       
                if(interaction.type !== "DEFAULT" && interaction.deferred) interaction.editReply({ embeds: [ embed(`Başarıyla <@${SelectedUserId}> kişine yayın izni verildi.`, "YELLOW", `Kanalda Yayın İzni Verildi`) ], components: [],ephemeral: true })
            }
            else if(selectedProcess === "odayayinengel"){      
                await channel.permissionOverwrites.edit(SelectedUserId, {
                    STREAM: false
                })
                const LogForChannel = await client.channels.fetch(process.env.roomlogchannel);
                await LogForChannel.send({ embeds: [ embed(`<@${member.id || interaction.member.id}> tarafından <@${SelectedUserId}> kişisinin <#${channel.id}> kanalında yayın izni engellendi.`, "BLUE", `Kanalda Yayın İzni Engellendi (${channel.id})`) ] })       
                if(interaction.type !== "DEFAULT" && interaction.deferred) interaction.editReply({ embeds: [ embed(`Başarıyla <@${SelectedUserId}> kişisinin yayın izni engellendi.`, "BLUE", `Kanalda Yayın İzni Engellendi`) ], components: [],ephemeral: true })
            }
            else if(selectedProcess === "odaetkizin"){      
                await channel.permissionOverwrites.edit(SelectedUserId, {
                    START_EMBEDDED_ACTIVITIES: true
                })
                const LogForChannel = await client.channels.fetch(process.env.roomlogchannel);
                await LogForChannel.send({ embeds: [ embed(`<@${member.id || interaction.member.id}> tarafından <@${SelectedUserId}> kişisinin <#${channel.id}> kanalında etkinlik izni verildi.`, "YELLOW", `Kanalda Etkinlik İzni Verildi (${channel.id})`) ] })       
                if(interaction.type !== "DEFAULT" && interaction.deferred) interaction.editReply({ embeds: [ embed(`Başarıyla <@${SelectedUserId}> kişine etkinlik izni verildi.`, "YELLOW", `Kanalda Etkinlik İzni Verildi`) ], components: [],ephemeral: true })
            }
            else if(selectedProcess === "odaetkengel"){      
                await channel.permissionOverwrites.edit(SelectedUserId, {
                    START_EMBEDDED_ACTIVITIES: false
                })
                const LogForChannel = await client.channels.fetch(process.env.roomlogchannel);
                await LogForChannel.send({ embeds: [ embed(`<@${member.id || interaction.member.id}> tarafından <@${SelectedUserId}> kişisinin <#${channel.id}> kanalında etkinlik izni engellendi.`, "BLUE", `Kanalda Etkinlik İzni Engellendi (${channel.id})`) ] })       
                if(interaction.type !== "DEFAULT" && interaction.deferred) interaction.editReply({ embeds: [ embed(`Başarıyla <@${SelectedUserId}> kişisinin etkinlik izni engellendi.`, "BLUE", `Kanalda Etkinlik İzni Engellendi`) ], components: [],ephemeral: true })
            
            }
            else {
                if(interaction.type !== "DEFAULT" && interaction.deferred) interaction.editReply({ embeds: [ embed(`Bu komut \`${data.name}(${selectedProcess})\` kullanılırken hata oluştu.`,"RED",) ], components: [], ephemeral: true })
                if(interaction.type === "DEFAULT") interaction.channel.send({ embeds: [ embed(`Bu komut \`(${selectedProcess})\` bulunamadı kontrol ediniz.`,"RED",) ]})
            }
        } catch (error) {
            if(interaction.type !== "DEFAULT" && interaction.deferred) interaction.editReply({ embeds: [ embed(`Bu komut \`${data.name}(${selectedProcess})\` kullanılırken hata oluştu.`,"RED",) ], components: [], ephemeral: true })
            console.error(error)
        }

        
    }
}

export const slash_data = {
    name: data.name,
    description: data.description,
    options: [  
        {
            name: "işlem",
            description: "Lütfen yapılacak işlemi seçin",
            type: 3,
            required: true,
            choices: [
                {name: "Odadan At",value: "odaat"},
                {name: "Blacklist Ekle",value: "blacklist"},
                {name: "Whitelist Ekle",value: "whitelist"},
                {name: "Ses Paneli İzni Ver",value: "odasespizin"},
                {name: "Ses Paneli İznini Engelle",value: "odasespengel"},
                {name: "Yayın İzni Ver",value: "odayayinizin"},
                {name: "Yayın İznini Engelle",value: "odayayinengel"},
                {name: "Etkinlik İzni Ver",value: "odaetkizin"},
                {name: "Etkinlik İznini Engelle",value: "odaetkengel"}
            ]
        },
        {
            name: "kullanıcı",
            description: "Lütfen kullanıcıyı girin",
            type: 6,
            required: true
        }
    ]
}