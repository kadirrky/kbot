import privrooms_panelupdate from "../../utils/bot/privrooms_panelupdate.js"
import { MessageActionRow, MessageButton } from "discord.js"
export const data = {
    name: "btnodayonetici",
    description:"Oluşturduğunuz kanalla ilgili yönetim (Devret-Moderatör) işlemlerini yaparsınız.",
    cooldown: 10,
    privroomcommands: "roomcommendadmin",
    async execute(interaction, foundchannedid = "") {  
        if(interaction.type === "DEFAULT") return
        const { embed } = interaction.client

        
        try { 

            const row = new MessageActionRow().setComponents(
                new MessageButton()
                    .setCustomId("btnodadevret")
                    .setLabel("Devret")
                    .setStyle("SUCCESS"),
                new MessageButton()
                    .setCustomId("btnodamod")
                    .setLabel("Mod")
                    .setStyle("SUCCESS"),
                new MessageButton()
                    .setCustomId("btnodaunmod")
                    .setLabel("unMod")
                    .setStyle("DANGER"),
            )            
            
            const row2 = new MessageActionRow().setComponents(
                new MessageButton()
                    .setCustomId("btnodanodegis")
                    .setLabel("Numara Değiş")
                    .setStyle("PRIMARY")
                    .setDisabled(true),

                new MessageButton()
                    .setCustomId("btnodayayincevir")
                    .setLabel("Yayın Odasına Çevir")
                    .setStyle("PRIMARY")
                    .setDisabled(true),
            )

                
            privrooms_panelupdate(interaction)
            interaction.reply({ 
                embeds: [embed(`• İşlem yapacağın kişi kanalda bulunmalı. \n• Kanalı devrettiğinizde sizin yöneticiliğiniz gider.`,"#2effe9","📌 Yönetici Paneli")],
                components: [row,row2],
                ephemeral: true 
            })        

        } catch (error) {
            console.error(error)
            interaction.reply({ embeds: [ embed(`Bu komut \`${data.name}\` kullanılırken hata oluştu.`,"RED",) ], ephemeral: true })
        }

        
    }
}