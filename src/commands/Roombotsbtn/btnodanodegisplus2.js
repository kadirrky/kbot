export const data = {
    name: "btnodanodegisplus2",
    description:"Oluşturduğunuz kanalda isim değiştirir.",
    cooldown: 10, 
    privroomcommands: "roomcommendadmin",
    async execute(interaction, foundchannedid = "") {  
        if(interaction.type === "DEFAULT") return
        
        const { embed } = interaction.client
        let { client, guild, channel } = interaction

        const category = guild.channels.cache.get(process.env.roomcatagory);
        let channelNumbers = []
        try { 
            if (category && category.type === 'GUILD_CATEGORY') {
                const topSecretChannels = category.children.filter(channel => {
                    return channel.type === 'GUILD_VOICE' && channel.name.startsWith('Top Secret') && channel.name.match(/\d$/);
                });
    
                console.log("alooooooo2")
                channelNumbers = topSecretChannels.map(channel => channel.name.match(/\d$/)[0]);
            } else {
                console.log('Category not found');
            }
            
                const numbestut = `${interaction.values}`
                
                await interaction.deferUpdate();
    
                if (channelNumbers.includes(numbestut)) {
                    await interaction.editReply({ embeds: [ embed(`${numbestut} numaralı oda kullanılıyor.`,"RED",) ], components: [], ephemeral: true })
                    return
                }
                const NewChannelName = `Top Secret ${numbestut}`

                await channel.setName(NewChannelName);

                if (interaction.type !== "DEFAULT" && interaction.deferred) await interaction.editReply({embeds: [embed(`Başarıyla kanalın numarası ${numbestut} yapıldı.`,"GREEN","Kanal Numarası Değişti")],components: [], ephemeral: true })
                const LogForChannel = await client.channels.fetch(process.env.roomlogchannel);
                await LogForChannel.send({ embeds: [ embed(`<@${interaction.member.id}> tarafından kanalın numarası ${numbestut} yapıldı`, "GREEN", `Kanal Numarası Değişti (${channel.id})`) ]})
        


        } catch (error) {
            console.error(error)
            interaction.reply({ embeds: [ embed(`Bu komut \`${data.name}\` kullanılırken hata oluştu.`,"RED",) ], ephemeral: true })
        }

        
    }
}