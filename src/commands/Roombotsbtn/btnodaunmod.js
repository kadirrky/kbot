import fs from 'fs';
import { MessageActionRow, MessageSelectMenu } from "discord.js"
export const data = {
    name: "btnodaunmod",
    description:"Oluşturduğunuz kanalda belilediğin kişiyi unMod yapan aracı verir.",
    cooldown: 10, 
    privroomcommands: "roomcommendadmin",
    async execute(interaction, foundchannedid = "") {  
        if(interaction.type === "DEFAULT") return
        
        const { embed } = interaction.client
        let { client, channel } = interaction

        
        try { 


            let ChannelModlength = "• Kanalda hiç mod bulunmuyor."
            let ChannelMod = "Mod Bulunamadı"
            const dataControl = fs.readFileSync('./database/roomsdata.json', 'utf8');
            if (dataControl){
                const json = JSON.parse(dataControl);    
                if (json) {
                    const ChannelModcntrl = json[channel.id].channelmod
                    if(ChannelModcntrl.length > 0) ChannelModlength = `• Kanalda \`${ChannelModcntrl.length}\` adet mod var.`
                    if(ChannelModcntrl.length > 0) ChannelMod = ChannelModcntrl
                }    
            }

            const formattedUsernames = [];
            const usedValues = [];
            
            if(ChannelMod !== "Mod Bulunamadı") ChannelMod.forEach(ChannelMod => {
            const user = client.users.cache.get(ChannelMod);
            if (!usedValues.includes(ChannelMod)) {
                formattedUsernames.push({
                    label: user ? user.username : ChannelMod,
                    description: user ? `${user.displayName}(${ChannelMod})` : ChannelMod,
                    value: ChannelMod
                });
                usedValues.push(ChannelMod);
            }
            });          

            
            const usersinthechannel = formattedUsernames

            
            let SelectMenuDisabledStatus = false
            let SelectMenuPlaceholder = "Moderatörlüğü Al"
            if(usersinthechannel.length <=0){
                usersinthechannel.push({ label: "---", description: "---", value: "000" });
                SelectMenuDisabledStatus = true
                SelectMenuPlaceholder = "Mod Bulunamadı"
            }

            const row = new MessageActionRow()
            .setComponents(
                new MessageSelectMenu()
                    .setCustomId("odaunmod")
                    .setPlaceholder(SelectMenuPlaceholder)
                    .setOptions([usersinthechannel])
                    .setDisabled(SelectMenuDisabledStatus)
            )
            await interaction.deferUpdate();

            await interaction.editReply({
                embeds: [embed(`• Mod'lar sadece butonlarla işlem yapabilir.`,"#2effe9","Kanalda unMod Yap")],
                components: [row], ephemeral: true })

        } catch (error) {
            console.error(error)
            interaction.reply({ embeds: [ embed(`Bu komut \`${data.name}\` kullanılırken hata oluştu.`,"RED",) ], ephemeral: true })
        }

        
    }
}