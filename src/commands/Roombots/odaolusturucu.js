import { MessageActionRow, MessageButton } from "discord.js"
import { MessageEmbed } from "discord.js"

export const data = {
    name: "odaolusturucu",
    description:"Oda oluşturmak için gerekli herşeyi verir.",
    cooldown: 100,    
    execute(interaction) {
        const prefix="!"
        const response = new MessageEmbed()
        .setDescription(`Her hangi bir kanala girmeden oda kuramadığınızı, odanın sadece sahibi tarafından komutların kullanabileceğini unutmayınız!`)
        .addFields({ name: '👍 Notlar:', value: "\u200b1) Tek başınıza oda kurup saatlerce durmanız kurallara aykırıdır.\n\u200b2) Odayı kitlediğiniz anda odada bulunan herkes whiteliste alınıyor.\n\u200b3) Odadan herkes çıkınca kanal otomatik silinir.\n\u200b4) Rahat bir sohbet ortamı olsa da kurallar aynı şekilde geçerlidir."})
        .addFields({ name: '📌 Kanal Paneli', value: "Kanalın sohbet kısmında bulunan panelden kanalları yönetebilirsiniz."})
        .addFields({ name: '📌 Ana Kanal Komutları: `('+prefix+'odakilitle)`', value: "`"+prefix+"odakilitle`  `"+prefix+"odakilitac`  `"+prefix+"odasespkapat`  `"+prefix+"odasespac`  `"+prefix+"odayayinkapat`  `"+prefix+"odayayinac`  `"+prefix+"odaetkkapat`  `"+prefix+"odaetkac`  `"+prefix+"limit`  `"+prefix+"odadurum`  `"+prefix+"odasil`"})
        .addFields({ name: '📌 Kullanıcı Kanal Komutları: `('+prefix+'odam {işlem} @kullanici)`', value: "**İşlem ayracına yazılabilecekler:**\n`odaat, blacklist, whitelist, odasespizin, odasespengel, odayayinizin, odayayinengel, odaetkizin, odaetkengel`"})
        .setAuthor({ name: "Oda Nasıl Oluşturulur?"})
        .setColor('PURPLE');

        const row = new MessageActionRow()
        .setComponents(
            new MessageButton()
                .setCustomId("odaolustur")
                .setLabel("Kendi Kanalını Oluşturmak İçin Tıkla!")
                .setStyle("SUCCESS")
        )
    
        interaction.reply({ embeds: [response], components: [row] })
        
    }
}

export const slash_data = {
    name: data.name,
    description: data.description
}