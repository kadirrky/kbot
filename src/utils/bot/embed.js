import { MessageEmbed } from "discord.js"
export default (description, color = "BLUE", title = "") => {    
    
    const response = new MessageEmbed()
        .setDescription(description)
        .setColor(color)
        .setTitle(title)

    return response
}