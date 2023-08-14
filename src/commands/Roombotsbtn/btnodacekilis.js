import { MessageActionRow, MessageSelectMenu } from "discord.js"
export const data = {
    name: "btnodacekilis",
    description:"Oluşturduğunuz kanalda belilediğin kişiler ile çekiliş yapar.",
    cooldown: 10, 
    privroomcommands: "roomcommendmod",
    async execute(interaction, foundchannedid = "") {  
        if(interaction.type === "DEFAULT") return
        
        const { embed } = interaction.client
        let { channel } = interaction

        
        try { 

            const usersinthechannel = [];
            channel.members.forEach(member => {
                usersinthechannel.push({ label: member.displayName, description: `${member.user.username}(${member.id})`, value: member.displayName });
            }); 

            
            let SelectMenuDisabledStatus = false
            let SelectMenuPlaceholder = "Çekiliş Yap"
            let SelectValues = "2"
            if(usersinthechannel.length <=1){
                usersinthechannel.push({ label: "---", description: "---", value: "000" });
                SelectMenuDisabledStatus = true
                SelectMenuPlaceholder = "Kullanıcı Bulunamadı"
                SelectValues = "0"
            }

            const row = new MessageActionRow()
            .setComponents(
                new MessageSelectMenu()
                    .setCustomId("btnodacekilisplus")
                    .setPlaceholder(SelectMenuPlaceholder)
                    .setOptions([usersinthechannel])      
                    .setDisabled(SelectMenuDisabledStatus)   
                    .setMinValues(2)    
            )
            await interaction.deferReply({ephemeral: true});

            await interaction.editReply({
                embeds: [embed(`• Çekiliş yapacağın kişiler (en az 2 kişi) kanalda bulunmalı.`,"ORANGE","Kanalda Çekiliş Yap")],
                components: [row], ephemeral: true })

        } catch (error) {
            console.error(error)
            interaction.reply({ embeds: [ embed(`Bu komut \`${data.name}\` kullanılırken hata oluştu.`,"RED",) ], ephemeral: true })
        }

        
    }
}