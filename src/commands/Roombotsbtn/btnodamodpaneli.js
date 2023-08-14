import privrooms_panelupdate from "../../utils/bot/privrooms_panelupdate.js"
import { MessageActionRow, MessageSelectMenu } from "discord.js"
export const data = {
    name: "btnodamodpaneli",
    description:"Kanalda mod panelini açar.",
    cooldown: 10, 
    privroomcommands: "roomcommendmod",
    async execute(interaction, foundchannedid = "") {  
        if(interaction.type === "DEFAULT") return
        
        const { embed } = interaction.client
        let { channel } = interaction

        
        try { 

            const usersinthechannel = [
                { label: "At", description: `Kullanıcıyı kanaldan atar.`, value: "odaat" },
                { label: "BlackList", description: `Kullanıcının kanala bağlanmasını engeller.`, value: "blacklist" },
                { label: "Whitelist", description: `Kullanıcının kanala bağlanmasına izin verir.`, value: "whitelist" },
                { label: "Ses Paneli Aç", description: `Kullanıcının ses Paneli izin verir.`, value: "odasespizin" },
                { label: "Ses Paneli Kapat", description: `Kullanıcının ses Paneli engeller.`, value: "odasespengel" },
                { label: "Yayın Aç", description: `Kullanıcının yayın açmasına izin verir.`, value: "odayayinizin" },
                { label: "Yayın Kapat", description: `Kullanıcının yayın açmasını engeller.`, value: "odayayinengel" },
                { label: "Etk. Aç", description: `Kullanıcının etkinlik açmasına izin verir.`, value: "odaetkizin" },
                { label: "Etk. Kapat", description: `Kullanıcının etkinlik açmasını engeller.`, value: "odaetkengel" },
            ];        

            const row = new MessageActionRow()
            .setComponents(
                new MessageSelectMenu()
                    .setCustomId("odamodpaneli")
                    .setPlaceholder("İşlem Seç")
                    .setOptions([usersinthechannel])
            )

            privrooms_panelupdate(interaction)
            interaction.reply({
                embeds: [embed(`• İşlem yapacağın kişi kanalda bulunmalı. \n• İşlemini aşağıdaki menüden seç.`,"#2effe9","Moderasyon Paneli")],
                components: [row],
                ephemeral: true 
            })        

        } catch (error) {
            console.error(error)
            interaction.reply({ embeds: [ embed(`Bu komut \`${data.name}\` kullanılırken hata oluştu.`,"RED",) ], ephemeral: true })
        }

        
    }
}