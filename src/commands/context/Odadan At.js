import privrooms_control from "../../utils/bot/privrooms_control.js"
const modrole = process.env.modrole.split(",")

export const data = {
    name: "Odadan At",
    description:"Oluşturduğunuz kanalda kullanıcıyı atar",
    cooldown: 10,   
    privroomcommands: "roomcommendadmin",
    priroomguard: "owner", 
    async execute(interaction, foundchannedid = "", foundchannedownerid = "") {  
        if(interaction.type === "DEFAULT") return
        
        const { client, member } = interaction
        const { embed } = interaction.client
        const command = {
            data:{
                name: data.name,
                privroomcommands: data.privroomcommands,
                privroomcommandsfound:"roomcommendfound"
            }
        }
        if(foundchannedid === "") return privrooms_control( command, interaction )       
        let channel
        if(foundchannedid !== "") {             
            channel = await client.channels.fetch(foundchannedid);
        }   
        console.log(interaction.channel.type)     
        interaction.deferReply({ ephemeral:true })        
        if(interaction.channel.type === "GUILD_VOICE"){
            interaction.deleteReply()
            .catch(console.error);
        } 
        const target = interaction.targetMember   
        
        //Moderator Controll
        if (target && (target.roles.cache.has(modrole[0]) || target.roles.cache.has(modrole[1]))) {
            return
        }

        // RoomOwnerGuard Control        
        if(interaction.type !== "DEFAULT" && foundchannedownerid === target.id){
            return
        }              
        
        const usersinthechannel = [];
        channel.members.forEach(member => {
            usersinthechannel.push(member.user.id);
        }); 
        if(!usersinthechannel.includes(target.id)) return
        target.voice.disconnect()        
        .then(async a  => {
            const LogForChannel = await client.channels.fetch(process.env.roomlogchannel);
            await LogForChannel.send({ embeds: [ embed(`<@${member.id || interaction.member.id}> tarafından <@${target.id}> kişisi <#${channel.id}> kanalından atıldı.`, "ORANGE", `Kullanıcı Kanaldan Atıldı (${channel.id})`) ] })
            if(interaction.channel.type === "GUILD_TEXT") interaction.editReply({ embeds: [ embed(`Başarıyla <@${target.id}> kişinini \`${channel.name}\` kanalında \`Blacklist\` eklediniz.`, "ORANGE", `Kullanıcı Kanaldan Atıldı`) ], ephemeral: true })
        })
        .catch(error => {
            //console.error(error)
            if(interaction.channel.type === "GUILD_TEXT") interaction.editReply({ embeds: [ embed(`Bu komut \`${data.name}\` kullanılırken hata oluştu.`,"RED",) ], ephemeral: true })
       })
    }
}

export const slash_data = {
    name: data.name,
    type: 2
}