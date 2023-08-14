import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9"
import { MessageEmbed } from "discord.js";


export default async guild => {

    const { client } = guild

    const rest = new REST({version: "9"}).setToken(process.env.token)

    const body = client.commands.map(command => command.slash_data)
    
    try{
        console.log("Command edits running...")

        await rest.put(
            Routes.applicationGuildCommands(client.user.id, guild.id),
            { body }
        )
        console.log("Command edits succesful.")

    } catch (e){
        if (e.code == 50001){
            const embed = new MessageEmbed()
                .setDescription("Slash Komutlar Başarılı bir şekilde kaydedilemedi")
                .setColor("RED")

            const owner = await guild.fetchOwner()
            owner.send({embeds:[embed]}).catch(()=>{ })
        }
    }

}