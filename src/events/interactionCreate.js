import cooldown_control from "../utils/cooldown_control.js";
// import register_commands from "../utils/bot/register_commands.js";
import privrooms_control from "../utils/bot/privrooms_control.js";

export default client => {

    const { embed } = client
    client.on('interactionCreate', interaction => {
        // if(interaction.isButton()) button_interactions(interaction)
        // await register_commands(interaction.guild)

        if (!interaction.isApplicationCommand() && !interaction.isButton() && !interaction.isSelectMenu() && !interaction.isModalSubmit()) return
        //if (!interaction.isCommand()) return
        const command = client.commands.get(interaction.commandName || interaction.customId)
        if(!command) return
        // Permission Control
        if (command.data.permission && !interaction.member.permissions.has(command.data.permission)) return interaction.reply({
            embeds : [
                embed(`Bu komutu kullanmak için \`${command.data.permission}\` yetkisine sahip olman gerekiyor.`,"RED")
            ]
        })

        // PrivRoomCommand Control
        if (command.data.privroomcommands) return privrooms_control( command, interaction)

        // Cooldown Control
        const cooldown = cooldown_control(command, interaction.member.id)
        if(cooldown) return interaction.reply({
            embeds: [
                embed(`Bu komutu tekrar kullanmak için \`${cooldown}\` saniye beklemelisiniz.`,"RED")
            ], ephemeral: true 
        })

        //Ececute Command
        try{
            command.data.execute(interaction)
        } catch(e){
            interaction.reply({ embeds: [ embed(`Bu komutu kullanırken bir hata oluştu.`,"RED") ] })
            console.log(e)
        }

    });

}