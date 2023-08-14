import { MessageEmbed } from "discord.js"

export const data = {
    name: "bilgi",
    description:"Kişinin bilgilerini getirir.",
    cooldown: 15,    
    execute(interaction) {

        const { embed } = interaction.client

        let target
        if (interaction.type !== "DEFAULT") target = interaction.targetMember
        if (interaction.type === "DEFAULT"){
            const selectedProcessv2 = interaction.content.slice(process.env.prefix.length+(data.name).length).trim().split(/ +/)
            if (!selectedProcessv2[0] || selectedProcessv2[1]) return
            const constmenitons = interaction.mentions.users.first() || "000"
            if(constmenitons === "000") target = interaction.guild.members.cache.get(`${selectedProcessv2[0]}`)
            if(constmenitons !== "000") target = interaction.guild.members.cache.get(constmenitons.id)

            if(!target) return interaction.channel.send({ embeds: [ embed(`Bu \`${constmenitons === "000" ? selectedProcessv2[0]:constmenitons.id}\` id'de kullanıcı bulunamadı.`, "RED") ]})
        } 
        const status = target.presence?.status ? target.presence.status.replace("online", `Çevrimiçi`).replace("dnd", "Rahatsız Etme").replace("idle", "Boşta") : "Çevrimdışı";

        
        let tür = {desktop: "Bilgisayar",mobile: "Telefon",web: "Web Tarayıcı"}
        let device = "Bilinmiyor veya Offline"
        if (target && target.presence && target.presence != null){
            const dev = Object.keys(target.presence.clientStatus)
            device = `${dev.map(x => `${tür[x]}`).join(", ")}`
        }
        const avatar = target.displayAvatarURL({dynamic: true, size: 2048})
        const png = target.displayAvatarURL({dynamic: true, size: 2048, format: "png"})
        const jpg = target.displayAvatarURL({dynamic: true, size: 2048, format: "jpg"})
        const jpeg = target.displayAvatarURL({dynamic: true, size: 2048, format: "jpeg"})
        const gif = target.displayAvatarURL({dynamic: true, size: 2048, format: "gif"})
        const webp = target.displayAvatarURL({dynamic: true, size: 2048, format: "webp"}) 
        let banner = "Bulunamadı"
        if(target.banner){        
            const extension = target.banner.startsWith("a_") ? ".gif" : ".png";
            const url = `https://cdn.discordapp.com/banners/${target.id}/${target.banner}${extension}?size=1024`
            banner = `[Tıkla](${url})`
        }


          let wherechanneltext
          const wherechannel = target.voice.channel;
          if (wherechannel) {
            wherechanneltext = `<#${wherechannel.id}>.`
          } else {
            wherechanneltext = `Kanalda gözükmüyor.`
          }




        const response = new MessageEmbed()
            .setColor("WHITE")
            .addFields(
                {name: `**» Kullanıcı Bilgileri:**`, value:`
                **• ID:** ${target.id}
                **• Kullanıcı Adı:** ${target.user.username}
                **• Sunucu Adı:** ${target.displayName === target.user.username ? "-":target.displayName}
                **• Hesap Kurulum:** <t:${parseInt(`${(target.user.createdTimestamp || 1000) / 1000}`)}:R>
                **• Sunucuya Katılma:** <t:${parseInt(`${(target.joinedTimestamp || 1000) / 1000}`)}:R>       
                ---
                `},
                {name: `**» Kullanıcı Durumu:**`, value:`
                **• Aktiflik Durumu:** ${status}  
                **• Bulunduğu Kanal:** ${wherechanneltext}
                **• Kullandığı Cihaz:** ${device}
                ---
                `},
                {name: `» Avatar Bilgileri:`, value:`Kendi Avatarı: [PNG](${png}) | [JPG](${jpg}) | [JPEG](${jpeg}) | [GIF](${gif}) | [WEBP](${webp})
                Banner: ${banner}
                ---`}
               // {name: `» Rol Bilgileri(${target.roles.cache.size - 1}):`, value:`${target.roles.cache.filter(rolename => !rolename.name.includes('@everyone')).map(rolename => rolename).join(" | ")}`}
            )
            .setThumbnail(`${target?.displayAvatarURL()}`)

        interaction.reply({ embeds: [response], ephemeral: true })
    }
}

export const slash_data = {
    name: data.name,
    type: 2
}