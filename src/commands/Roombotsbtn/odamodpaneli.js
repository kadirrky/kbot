import { MessageActionRow, MessageSelectMenu, MessageButton } from "discord.js"
export const data = {
    name: "odamodpaneli",
    description:"Mod panelinde seçme işlevi görür.",
    cooldown: 10, 
    privroomcommands: "roomcommendmod",
    async execute(interaction, foundchannedid = "") {  
        if(interaction.type === "DEFAULT") return
        
        const { embed } = interaction.client
        let { channel } = interaction   

        
        try { 

            const SelectedValue = `${interaction.values}`

            let MessageContents = ""

            if(SelectedValue === "odaat"){
                MessageContents = "Seçtiğiniz kişi kanaldan atılacak."
            }
            else if(SelectedValue === "blacklist"){
                MessageContents = "Seçtiğiniz kişi blackliste eklenecek."
            }
            else if(SelectedValue === "whitelist"){
                MessageContents = "Seçtiğiniz kişi whiteliste eklenecek."
            }
            else if(SelectedValue === "odasespizin"){
                MessageContents = "Seçtiğini kişinin ses panel izni olacak."
            }
            else if(SelectedValue === "odasespengel"){
                MessageContents = "Seçtiğini kişinin ses panel engeli olacak."
            }
            else if(SelectedValue === "odayayinizin"){
                MessageContents = "Seçtiğini kişinin yayın izni olacak."
            }
            else if(SelectedValue === "odayayinengel"){
                MessageContents = "Seçtiğini kişinin yayın engeli olacak."
            }
            else if(SelectedValue === "odaetkizin"){
                MessageContents = "Seçtiğini kişinin etkinlik izni olacak."
            }
            else if(SelectedValue === "odaetkengel"){
                MessageContents = "Seçtiğini kişinin etkinlik engeli olacak."
            }
            else{
                MessageContents = ""
            }

            const usersinthechannel = [];
            channel.members.forEach(member => {
                usersinthechannel.push({ label: member.displayName, description: `${member.user.username}(${member.id})`, value: member.id });
            }); 
            
            let SelectMenuDisabledStatus = false
            let SelectMenuPlaceholder = "Kullanıcı Seç"
            if(usersinthechannel.length <=0){
                usersinthechannel.push({ label: "---", description: "---", value: "000" });
                SelectMenuDisabledStatus = true
                SelectMenuPlaceholder = "Kullanıcı Bulunamadı"
            }

            const row = new MessageActionRow()
            .setComponents(
                new MessageSelectMenu()
                    .setCustomId("odamodpaneliplus")
                    .setPlaceholder(SelectMenuPlaceholder)
                    .setOptions([usersinthechannel])      
                    .setDisabled(SelectMenuDisabledStatus)
            )
            const row2 = new MessageActionRow().setComponents(
                new MessageButton()
                    .setCustomId("odamodpaneliplusid")
                    .setLabel("Id Kullanarak İşlem Yap")
                    .setStyle("SUCCESS")
            )

            await interaction.deferUpdate();

            if (interaction.deferred) await interaction.editReply({
                content: SelectedValue,
                embeds: [embed(`• İşlem yapacağın kişi kanalda bulunmalı.\n• ${MessageContents}`,"#2effe9","İşlem Yapacağın Kişiyi Seç")],
                components: [row,row2], ephemeral: true })

        } catch (error) {
            console.error(error)
            interaction.reply({ embeds: [ embed(`Bu komut \`${data.name}\` kullanılırken hata oluştu.`,"RED",) ], ephemeral: true })
        }     
    }
}