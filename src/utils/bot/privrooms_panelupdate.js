import fs from 'fs';
import { MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu } from "discord.js"

export default (interaction) => {
   
    const { client, channel, member } = interaction
    try {
        let RoomLockStatus = "✅"
        let RoomMicStatus = "✅"
        let RoomStreamStatus = "✅"
        let RoomEtkStatus = "✅"
        let RoomLockStatusBtn = new MessageButton().setCustomId("odakilitle").setLabel("Kilitle").setStyle("DANGER")
        let RoomMicStatusBtn = new MessageButton().setCustomId("odasespkapat").setLabel("Ses P.").setStyle("DANGER")
        let RoomStreamStatusBtn = new MessageButton().setCustomId("odayayinkapat").setLabel("Yayın").setStyle("DANGER")
        let RoomEtkStatusBtn = new MessageButton().setCustomId("odaetkkapat").setLabel("Etk.").setStyle("DANGER")

        const role = channel.guild.roles.cache.get(process.env.roommemberrole);
        const overwritesForRole = channel.permissionOverwrites.cache.filter(o => o.type === 'role' && o.id === role.id); 

        if (overwritesForRole.size > 0 && !overwritesForRole.first().allow.has('CONNECT')) {
            RoomLockStatusBtn = new MessageButton().setCustomId("odakilitac").setLabel("Kilit Aç").setStyle("SUCCESS")
            RoomLockStatus = "❌"
        }
        if (overwritesForRole.size > 0 && !overwritesForRole.first().allow.has('USE_SOUNDBOARD')) {
            RoomMicStatusBtn = new MessageButton().setCustomId("odasespac").setLabel("Ses P.").setStyle("SUCCESS")
            RoomMicStatus = "❌"
        }
        if (overwritesForRole.size > 0 && !overwritesForRole.first().allow.has('STREAM')) {
            RoomStreamStatusBtn = new MessageButton().setCustomId("odayayinac").setLabel("Yayın").setStyle("SUCCESS")
            RoomStreamStatus = "❌"
        }
        if (overwritesForRole.size > 0 && !overwritesForRole.first().allow.has('START_EMBEDDED_ACTIVITIES')) {
            RoomEtkStatusBtn = new MessageButton().setCustomId("odaetkac").setLabel("Etk.").setStyle("SUCCESS")
            RoomEtkStatus = "❌"
        }

        const RoomPanelLimits = [];
        for (let i = 2; i <= 25; i++) {
            RoomPanelLimits.push({ label: i.toString(), value: i.toString() });
        }
        const row1 = new MessageActionRow().setComponents(
            new MessageSelectMenu()
                .setCustomId("odalimit")
                .setPlaceholder(`Kanal Limiti: ${channel.userLimit}`)
                .setOptions(RoomPanelLimits)             
        )
        
        const row2 = new MessageActionRow().setComponents(
            RoomLockStatusBtn,
            RoomMicStatusBtn,
            RoomStreamStatusBtn,
            RoomEtkStatusBtn
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
                .setStyle("SECONDARY"),
        )

        let ChannelOwner = "Bulunamadı"
        let ChannelMod = "Yok"
        
        const data = fs.readFileSync('./database/roomsdata.json', 'utf8');
        if (data){
            const json = JSON.parse(data);
            if (json) ChannelOwner = `<@${json[channel.id].channeladmin}>`        
            if (json) {
                const ChannelModcntrl = json[channel.id].channelmod
                const ChannelModControl = ChannelModcntrl.length
                if(ChannelModcntrl.length > 0) ChannelMod = `${ChannelModcntrl.length} Adet`
                // ChannelMod = `\nKanal Moderatörü: ${ChannelModcntrl.map(Mods => `<@${Mods}>`).join(', ')}`
            }

        }

        const RoomPanelInfo = new MessageEmbed()
        .addFields({ name: 'Kanal Yönetimi', value: `Kanal Sahibi: ${ChannelOwner}\nKanal Limiti: \`${channel.userLimit}\`\nKanal İsmi: \`${channel.name}\`\nKanal Moderatörü: \`${ChannelMod}\``})
        .addFields({ name: 'Kanal İzinleri', value: `\`Kilit:${RoomLockStatus}\` | \`Ses P.:${RoomMicStatus}\` | \`Yayın:${RoomStreamStatus}\` | \`Etkinlik:${RoomEtkStatus}\``})
        .setColor('#2effe9');
        
        interaction.message.edit({ embeds: [RoomPanelInfo], components: [row1, row2, row3, row4] })
    }
    catch (error) {
        console.error(error)
      }

}
