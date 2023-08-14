import { MessageActionRow, MessageSelectMenu } from "discord.js"
export const data = {
    name: "btnodadevret",
    description:"Oluşturduğunuz kanalı başkasına devredecek listeyi açar.",
    cooldown: 10, 
    privroomcommands: "roomcommendadmin",
    async execute(interaction, foundchannedid = "") {  
        if(interaction.type === "DEFAULT") return
        
        const { embed } = interaction.client
        let { channel } = interaction

        
        try { 

            const usersinthechannel = [];
            channel.members.forEach(member => {
                usersinthechannel.push({ label: member.displayName, description: `${member.user.username}(${member.id})`, value: member.id });
            });
            let SelectMenuDisabledStatus = false
            let SelectMenuPlaceholder = "Kanalı Devret"
            if(usersinthechannel.length <=0){
                usersinthechannel.push({ label: "---", description: "---", value: "000" });
                SelectMenuDisabledStatus = true
                SelectMenuPlaceholder = "Kullanıcı Bulunamadı"
            }

            const row = new MessageActionRow()
            .setComponents(
                new MessageSelectMenu()
                    .setCustomId("odadevret")
                    .setPlaceholder(SelectMenuPlaceholder)
                    .setOptions([usersinthechannel])
                    .setDisabled(SelectMenuDisabledStatus)
            )
            await interaction.deferUpdate();

            await interaction.editReply({
                embeds: [embed(`• İşlem yapacağın kişi kanalda bulunmalı. \n• Kanalı devrettiğinizde sizin yöneticiliğiniz gider.`,"#2effe9","Kanalı Devret")],
                components: [row], ephemeral: true })

        } catch (error) {
            console.error(error)
            interaction.reply({ embeds: [ embed(`Bu komut \`${data.name}\` kullanılırken hata oluştu.`,"RED",) ], ephemeral: true })
        }

        
    }
}