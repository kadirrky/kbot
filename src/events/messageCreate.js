import cooldown_control from "../utils/cooldown_control.js";
import privrooms_control from "../utils/bot/privrooms_control.js";
import embed from "../utils/bot/embed.js";

export default client => {
    const prefix = process.env.prefix

    client.on('messageCreate', message => {

        if (message.type !== "DEFAULT") return
        if (message.content.startsWith(prefix) == false) return

        const args = message.content.slice(1).trim().split(/ +/)
        const commandName = args.shift().toLowerCase()

        const command = client.commands.get(commandName)
        if(!command) return

        // Permission Control
        if(command.permission && !message.member.permissions.has(command.permission)) return message.reply({
            embeds : [
                embed(`Bu komutu kullanmak için \`${command.permission}\` yetkisine sahip olman gerekiyor.`,"RED")
            ]
        })

        // PrivRoomCommand Control
        if (command.data.privroomcommands) return privrooms_control( command, message)

        // Cooldown_control
        const cooldown = cooldown_control(command,message.member.id)
        if (cooldown) return message.reply({
            embeds: [
                embed(`Bu komutu tekrar kullanmak için \`${cooldown}\` saniye beklemelisiniz.`,"RED")
            ]
        }).then(async msg  => {
            setTimeout(() => {
                msg.delete()
              }, cooldown*1000 + 1000);
              
        })

        try{
            const interaction = message
            command.data.execute(interaction)
        } catch (e){
            console.log(e)
            message.reply(`Bu komutta \`${commandName}\` şu anda hata var!`)
        }
    });

}