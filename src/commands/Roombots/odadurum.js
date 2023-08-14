import { MessageEmbed, Permissions } from "discord.js"
import privrooms_control from "../../utils/bot/privrooms_control.js"
import privrooms_panelupdate from "../../utils/bot/privrooms_panelupdate.js"
import fs from 'fs';
export const data = {
    name: "odadurum",
    description:"Oluşturduğunuz kanalın istatistiklerini verir.",
    cooldown: 5,
    privroomcommands: "roomcommendmod",
    async execute(interaction, foundchannedid = "") {
        if (interaction.type === "DEFAULT") return 
        //interaction.reply({ embeds: [ embed(`Bu komutu \`Slash_Command veya Button\` ile kullanabilirsiniz.`,"RED",) ] })        
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
            if(interaction.type !== "DEFAULT") await interaction.deferReply({ ephemeral:true })

            const RoomPermsControl = channel.permissionOverwrites.cache;

            const RoomBlackListUsers = RoomPermsControl
            .filter((overwrite) => overwrite.type === 'member' && !overwrite.allow.has(Permissions.FLAGS.CONNECT))
            .map((overwrite) => overwrite.id);    
            const RoomWhiteListUsers = RoomPermsControl
            .filter((overwrite) => overwrite.type === 'member' && overwrite.allow.has(Permissions.FLAGS.CONNECT))
            .map((overwrite) => overwrite.id);
            let ChannelOwner = "Bulunmadı";
            let BlacklistStatus = "Kimse Yok";
            let WhitelistStatus = "Kimse Yok";
            let ChannelMod = "Kimse Yok";
            let ChannelModlength = "Yok";
            if(RoomBlackListUsers.length > 0){
                BlacklistStatus = RoomBlackListUsers.map(blacklistmember => `<@${blacklistmember}>`).join(', ');  
            }
            if(RoomWhiteListUsers.length > 0){
                WhitelistStatus = RoomWhiteListUsers.filter(whitelistmember => !whitelistmember.includes(client.user.id)).map(whitelistmember => `<@${whitelistmember}>`).join(', ');
            }
            const dataControl = fs.readFileSync('./database/roomsdata.json', 'utf8');
            if (dataControl){
                const json = JSON.parse(dataControl);
                if (json) ChannelOwner = `<@${json[channel.id].channeladmin}>`        
                if (json) {
                    const ChannelModcntrl = json[channel.id].channelmod
                    if(ChannelModcntrl.length > 0) ChannelModlength = `${ChannelModcntrl.length} Adet`
                    if(ChannelModcntrl.length > 0) ChannelMod = `${ChannelModcntrl.map(Mods => `<@${Mods}>`).join(', ')}`
                }    
            }

                    const response = new MessageEmbed()
                .setColor("PURPLE")
                .addFields(
                    {name:"[Kanal Bilgileri]:", value: `» Kanal Adı: \`${channel.name}\`\n» Kanal ID: \`${channel.id}\`\n» Kanal Moderatörleri: \`${ChannelModlength}\`\n» Kanal Sahibi: ${ChannelOwner}\n`}
                ) 
                .addFields(
                    {name: `[BlackList]:`, value:`${BlacklistStatus}`, inline: true},
                    {name: `[WhiteList]:`, value:`${WhitelistStatus}`, inline: true},
                    {name: `[Moderatörler]:`, value:`${ChannelMod}`, inline: true}
                )

            setTimeout(() => {
            }, 5000)
                try {         
                    await interaction.editReply({ embeds: [response], ephemeral: true  })
                } catch (error) {
                    console.error("Hata oluştu:", error);
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