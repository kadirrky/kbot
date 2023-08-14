import { MessageActionRow, MessageSelectMenu } from "discord.js"
export const data = {
    name: "btnodacekilisplus",
    description:"Oluşturduğunuz kanalda belilediğin kişiler ile çekilişin son işlemini yapar.",
    cooldown: 10, 
    privroomcommands: "roomcommendmod",
    async execute(interaction, foundchannedid = "") {  
        if(interaction.type === "DEFAULT") return
        
        const { embed } = interaction.client
        let { client, channel, member } = interaction

        
        try { 

            const selectedmembers = interaction.values
            const randomIndex = Math.floor(Math.random() * selectedmembers.length);
            const winner = selectedmembers[randomIndex];
            await interaction.deferUpdate();

            await interaction.editReply({
            embeds: [embed(`• Katılımcılar: ${selectedmembers}\n• Kazanan: ${winner}`,"ORANGE","Kanalda Çekiliş Yap")],
            components: [], ephemeral: true })        
            const LogForChannel = await client.channels.fetch(process.env.roomlogchannel);
            await LogForChannel.send({ embeds: [ embed(`<@${member.id || interaction.member.id}> tarafından <#${channel.id}> kanalında \`${selectedmembers}\` kişileri ile çekiliş yapıldı ve \`${winner}\` kazandı.`, "ORANGE", `Kanal Devredildi (${channel.id})`) ]})

        } catch (error) {
            console.error(error)
            interaction.reply({ embeds: [ embed(`Bu komut \`${data.name}\` kullanılırken hata oluştu.`,"RED",) ], ephemeral: true })
        }

        
    }
}