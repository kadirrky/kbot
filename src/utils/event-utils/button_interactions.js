import { MessageEmbed } from "discord.js"

export default interaction => {
    const responseEmbed = new MessageEmbed()
        .setDescription("deneme 123 test")
        .setColor("BLUE")
    console.log(interaction.customdId)
}