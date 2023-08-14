export const data = {
    name: "btnmoderatorcagirbtn",
    description:"Bulunduğunu kanala moderatör çağıracak butonu atar.",
    cooldown: 60, 
    async execute(interaction) {  
        if(interaction.type === "DEFAULT" && !interaction.isButton()) return
        
        const { embed } = interaction.client     
        const { channel, client, member } = interaction

        const LogForChannel = await client.channels.fetch("1130906634311450774");
        await LogForChannel.send({ content: "<@&1130910594560708668>", embeds: [ embed(`<@${member.id || interaction.member.id}> tarafından <#${channel.id}> kanalında moderatör çağırılıyor.`, "BLUE") ] })
        .catch(error => {
            console.error(error)
            interaction.editReply({embeds: [ embed(`Bu komut \`${data.name}\` kullanılırken hata oluştu.`,"RED",) ], ephemeral: true })
       })        
    }
}