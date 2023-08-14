import { MessageActionRow, MessageSelectMenu } from "discord.js"
export const data = {
    name: "btnodanodegis",
    description:"Oluşturduğunuz kanalda isim değiştirir.",
    cooldown: 10, 
    privroomcommands: "roomcommendadmin",
    async execute(interaction, foundchannedid = "") {  
        if(interaction.type === "DEFAULT") return
        
        const { embed } = interaction.client

        try { 

            const numbersayi = [];
            for (let i = 1; i <= 20; i++) {
                numbersayi.push({ label: i.toString(), value: i.toString() });
            }       
            const row1 = new MessageActionRow().setComponents(
                new MessageSelectMenu()
                    .setCustomId("btnodanodegisplus1")
                    .setPlaceholder("1-20")
                    .setOptions(numbersayi)             
            )
            const numbersayi2 = [];
            for (let i = 21; i <= 40; i++) {
                numbersayi2.push({ label: i.toString(), value: i.toString() });
            }       
            const row2 = new MessageActionRow().setComponents(
                new MessageSelectMenu()
                    .setCustomId("btnodanodegisplus2")
                    .setPlaceholder("21-40")
                    .setOptions(numbersayi2)             
            )
            await interaction.deferUpdate()
            await interaction.editReply({
                embeds: [embed(`• Kanalınızın son hanesindeki sayıyı değiştirebilirsiniz. \n• Var olan numaralı odayı seçmek yasaktır.`,"#2effe9","Kanal No Değiş")],
                components: [row1,row2], ephemeral: true })

        } catch (error) {
            console.error(error)
            interaction.reply({ embeds: [ embed(`Bu komut \`${data.name}\` kullanılırken hata oluştu.`,"RED",) ], ephemeral: true })
        }

        
    }
}