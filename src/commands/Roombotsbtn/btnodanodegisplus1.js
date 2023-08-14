export const data = {
    name: "btnodanodegisplus1",
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
                console.log(`Top Secret ${numbestut}`)
                const newChannelName = `Top Secret ${numbestut}`;

                const targetChannel = interaction.guild.channels.cache.get(channel.id);
                if (targetChannel && targetChannel.isVoice()) {
                targetChannel.edit({ name: newChannelName })
                    .then(updatedChannel => {
                    console.log(`Kanal adı güncellendi: ${updatedChannel.name}`);
                    })
                    .catch(error => {
                    console.error('Kanal adı güncellenirken bir hata oluştu:', error);
                    });
                }
        


        } catch (error) {
            console.error(error)
            interaction.reply({ embeds: [ embed(`Bu komut \`${data.name}\` kullanılırken hata oluştu.`,"RED",) ], ephemeral: true })
        }

        
    }
}