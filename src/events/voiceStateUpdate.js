import privrooms_control from "../utils/bot/privrooms_control.js";
import embed from "../utils/bot/embed.js";

const PrivRoomsCategoryId = process.env.roomcatagory

export default client => {
    client.on('voiceStateUpdate', async (oldState, newState) => {

                // Top Secret Oto kanal Silme
                if (oldState.channel && oldState.channel.parent && oldState.channel.parent.id === PrivRoomsCategoryId) {
                    const channel = oldState.channel
                    if (oldState.channelId && oldState.channelId !== newState.channelId && channel.name.startsWith('Top Secret') && channel.members.size === 0){
                        if (!channel.name.startsWith('Top Secret')) return
        
                        channel.delete()
                        .then(async channel  => {
                            const command = {
                                data:{
                                    roomsizethendelete:"roomsizethendelete",
                                    privroomcommands:"roomcommenddatadel",
                                    privroomchannelid: channel.id
                                }
                            }
                            privrooms_control( command, "nointeraction", client )
                            const LogForChannel = await client.channels.fetch(process.env.roomlogchannel);
                            await LogForChannel.send({ embeds: [ embed(`Kanalda kimse kalmadığı için \`${channel.name}\` kanalı silindi.`, "RED", `Kanal Silindi (${channel.id})`) ] })
                        })
                        .catch(error => {
                            console.error(error)
                       })
                    }
                }

    });
}