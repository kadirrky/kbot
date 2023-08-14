import register_commands from "./register_commands.js"

export default client => {
    return
    client.guilds.cache.forEach(async guild => {
        //console.log(guild.name) // Bulunduğu sunucuları döndürür.
        const commands = (await guild.commands.fetch().catch(() => { })) || client.commands

        if(commands.size != client.commands.size) register_commands(guild) 
    })

}