import { MessageActionRow, MessageButton, MessageSelectMenu,Permissions  } from "discord.js"
import { MessageEmbed } from "discord.js"
import privrooms_control from "../../utils/bot/privrooms_control.js";

const memberrole = process.env.roommemberrole;
const modrole = process.env.modrole.split(",")

export const data = {
    name: "odaolustur",
    description:"Sizin yönetebileceğiniz oda oluşturur.",
    cooldown: 60,    
    privroomcommands: "roomcommendcreate",
    async execute(interaction) {

        let errorStatus = "false"
        // throw "ping komutu bulunamadı"
        const { client,guild } = interaction
        const { embed } = interaction.client
        const RoomOwner = interaction.user?.id || interaction.author.id
        
        
        try { 
        const memberVoiceState = interaction.member.voice
        if (!memberVoiceState.channel) return interaction.reply({ embeds: [ embed(`Bir ses kanalına bağlandıktan sonra tekrar deneyiniz.`,"RED") ], ephemeral: true })

        const category = interaction.channel.parent
        if (category.children.filter((channel) => channel).size >= 50) return interaction.reply({ embeds: [ embed(`En yüksek kanal sayısına ulaşıldı. Lütfen daha sonra deneyiniz.`,"RED") ], ephemeral: true })
        const numChannels = category.children.filter(c => c.type === 'GUILD_VOICE' && c.name.startsWith('Top Secret')).size;        
        let channelName;  
        for (let i = 1; i <= numChannels + 1; i++) {
            const name = `Top Secret ${i}`;
            if (!category.children.find(c => c.type === 'GUILD_VOICE' && c.name === name)) {
                channelName = name;
                break;
            }
        }
        // const categoryOverwrites = category.permissionOverwrites;

        // const channel = await interaction.guild.channels.create(channelName, {
        // type: 'GUILD_VOICE',
        // parent: category,
        // position: category.children.size,
        // permissionOverwrites: [   ...categoryOverwrites,     
        //     // {
        //     // id: client.user.id, // Rolün ID'si
        //     // allow: ['CONNECT','SPEAK','STREAM','START_EMBEDDED_ACTIVITIES','SEND_MESSAGES','MANAGE_CHANNELS']
        //     // }, 
        //     {
        //     id: modrole[0], // Rolün ID'si
        //     allow: ['CONNECT','SPEAK','STREAM','START_EMBEDDED_ACTIVITIES'] // modrole1 "full" yetkisi verin
        //     }, 
        //     {
        //     id: modrole[1], // Rolün ID'si
        //     allow: ['CONNECT','SPEAK','STREAM','START_EMBEDDED_ACTIVITIES'] // modrole2 "full" yetkisi verin
        //     }, 
        //     {
        //     id: memberrole, // Rolün ID'si
        //     allow: ['CONNECT','SPEAK'], // memberrole "yarifull" yetkisi verin
        //     deny: ['STREAM','START_EMBEDDED_ACTIVITIES'] 
        //     },
        //     {
        //     id: RoomOwner, // kanalsahibi ID'si
        //     allow: ['CONNECT','SPEAK','STREAM','START_EMBEDDED_ACTIVITIES'] // @kanalsahibi "full" yetkisi verme
        //     },
        //     {
        //     id: interaction.guild.id, // @everyone rolünün ID'si
        //     deny: ['CONNECT','SEND_MESSAGES'] // @everyone rolüne "CONNECT" yetkisi verme
        //     }
        // ]
        // })

// Yeni bir ses kanalı oluştururken izinleri toplu olarak ayarlayın:

        const channel = await interaction.guild.channels.create(channelName, {
            type: 'GUILD_VOICE',
            parent: category,
            position: category.children.size
        })
        .catch(error => {
            interaction.reply({ embeds: [ embed(`Botun yetkisi olmadığı için kanal oluşturamadım.`,"RED") ], ephemeral: true })
            errorStatus = "true"
            console.error(error)
        })
        if(errorStatus === "true") return

        try {
            await memberVoiceState.setChannel(channel)
            await interaction.deferReply({ ephemeral: true })
            // .then(async aa => {
            //     interaction.reply({ embeds: [ embed(`Başarıyla kanalınız oluşturuldu.`, "GREEN") ], ephemeral: true })
            // })
            // .catch(error => {
            //     interaction.reply({ embeds: [ embed(`Kanal oluştu fakat sizi taşıyamadık.`, "RED") ], ephemeral: true })
            // })
        } catch (error) {
            console.error("Kanal bulunmadı.");
        }

        try {
            await channel.permissionOverwrites.edit(modrole[0], {
                CONNECT: true,
                USE_SOUNDBOARD: true,
                STREAM: true,
                START_EMBEDDED_ACTIVITIES: true,
            })        
            await channel.permissionOverwrites.edit(modrole[1], {
                CONNECT: true,
                USE_SOUNDBOARD: true,
                STREAM: true,
                START_EMBEDDED_ACTIVITIES: true,
            })
            await channel.permissionOverwrites.edit(memberrole, {
                CONNECT: true,
                USE_SOUNDBOARD: true,
                STREAM: false,
                START_EMBEDDED_ACTIVITIES: false,
            })
            await channel.permissionOverwrites.edit(RoomOwner, {
                CONNECT: true,
                USE_SOUNDBOARD: true,
                STREAM: true,
                START_EMBEDDED_ACTIVITIES: true,
            })
            await channel.permissionOverwrites.edit(interaction.guild.id, {
                CONNECT: false,
                SEND_MESSAGES: false,
            })
        } catch (error) {
            console.error("Kanal yetkileri verilirken hata oluştu.");
        }        
        

        const command = {
            data:{
                privroomcommands:"roomcommenddataadd",
                privroomchannelid: channel.id
            }
        }
        privrooms_control( command, interaction )

        const LogForChannel = await client.channels.fetch(process.env.roomlogchannel);
        await LogForChannel.send({ embeds: [ embed(`<@${RoomOwner}> tarafından <#${channel.id}> kanalı oluşturuldu.`, "GREEN", `Kanal Oluştu (${channel.id})`) ] })
        
        const RoomPanelInfo = new MessageEmbed()
        .addFields({ name: 'Kanal Yönetimi', value: `Kanal Sahibi: <@${RoomOwner}>\nKanal Limiti: \`10\`\nKanal İsmi: \`${channel.name}\``})
        .addFields({ name: 'Kanal İzinleri', value: "`Kilit:✅` | `Ses P.:✅` | `Yayın:❌` | `Etkinlik:❌`"})
        .setColor('#2effe9');

        const RoomPanelLimits = [];
        for (let i = 2; i <= 25; i++) {
            RoomPanelLimits.push({ label: i.toString(), value: i.toString() });
        }

        const row1 = new MessageActionRow().setComponents(
            new MessageSelectMenu()
                .setCustomId("odalimit")
                .setPlaceholder("Kanal Limiti")
                .setOptions(RoomPanelLimits)             
        )

        const row2 = new MessageActionRow().setComponents(
            new MessageButton()
                .setCustomId("odakilitle")
                .setLabel("Kilitle")
                .setStyle("DANGER"),
            new MessageButton()
                .setCustomId("odasespkapat")
                .setLabel("Ses P.")
                .setStyle("DANGER"),
            new MessageButton()
                .setCustomId("odayayinac")
                .setLabel("Yayın")
                .setStyle("SUCCESS"),
            new MessageButton()
                .setCustomId("odaetkac")
                .setLabel("Etk.")
                .setStyle("SUCCESS"),
        )

        const row3 = new MessageActionRow().setComponents(
            new MessageButton()
                .setCustomId("btnodayonetici")
                .setLabel("Yönetici")
                .setStyle("PRIMARY"),
            new MessageButton()
                .setCustomId("btnodamodpaneli")
                .setLabel("Mod Paneli")
                .setStyle("PRIMARY"),
            new MessageButton()
                .setCustomId("odasil")
                .setLabel("Kanalı Sil")
                .setStyle("PRIMARY"),
        )

        const row4 = new MessageActionRow().setComponents(
            new MessageButton()
                .setCustomId("odadurum")
                .setLabel("Durum")
                .setStyle("SECONDARY"),
            new MessageButton()
                .setCustomId("btnodacekilis")
                .setLabel("Çekiliş")
                .setStyle("SECONDARY")
        )

        try {   
            await channel.setUserLimit(10)     
        } catch (error) {
            console.error("Oda limiti düzenlenemedi.");
        }

        try {   
            await channel.send({ embeds: [RoomPanelInfo], components: [row1, row2, row3, row4] })
        } catch (error) {
            console.log("Panel Yazdırılamadı")
        }

        
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