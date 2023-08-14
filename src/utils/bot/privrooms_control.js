import fs from 'fs';

import databasebackup from '../databasebackup.js';
export default (command, interaction, customclient="") => {
    
    const { client } = interaction
    const { embed } = interaction.client || customclient
    const { channel, member } = interaction

    let errorStatus = "false"
    
    const filePath = './database/roomsdata.json';

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Dosya okuma hatası:', err);
            errorStatus = "true"    
        }
        if(errorStatus === "true") return interaction.reply({ embeds: [ embed(`Data okunurken hata çıktı.`,"RED") ]}) 

        //const jsonData = JSON.parse(data)
        let jsonData
        try{
            jsonData = JSON.parse(data)
        } catch (error) {   
            console.error(error)
            fs.readFile('./database/roomsdatabackup.json', 'utf8', (err, data) => {
                if (err) {
                  console.error('Yedek dosya okunurken bir hata oluştu:', err);
                  return;
                }
              
                fs.writeFile('./database/roomsdata.json', data, 'utf8', (err) => {
                  if (err) {
                    console.error('Yedek dosya yazılırken bir hata oluştu:', err);
                    return;
                  }
                  console.log('Yedek dosya başarıyla kopyalandı.');
                });
              });
            return
        }
        
        const validCommands = [
          "roomcommenddataadd",
          "roomcommenddatadel",
          "roomcommenddatamoddel",
          "roomcommenddatamodadd",
          "roomcommenddataadminedit"
      ];
      
      if (validCommands.includes(command.data.privroomcommands)) {
            setTimeout(function() {databasebackup("roomsdata")}, 3000);
      }
        

        //Found Control
        const foundroomcommends = command.data.privroomcommands
        const foundcommanddataname = command.data.name || ""
        if (command.data.privroomcommandsfound === "roomcommendfound"){
            let found = false;
            let parameterName = '';
            let foundchannedownerid = '';
      
            for (const parameter in jsonData) {
                if (jsonData.hasOwnProperty(parameter)) {
                    const channelData = jsonData[parameter];
                    if (channelData.channeladmin === member.id) {
                        
                        found = true;
                        parameterName = parameter;
                        foundchannedownerid = channelData.channeladmin
                        break;

                    }
                }
            }
            const channel = {id:parameterName}
            const command = client.commands.get(foundcommanddataname)
            
            if (!found) return interaction.reply({ embeds: [ embed(`Bu komutu kullanmak için \`Kanal Sahibi\` olmanız gerekli.`,"RED") ], ephemeral:true})
            
            // Mod Control
            else if(foundroomcommends === "roomcommendmod"){
                if (!(jsonData[channel.id] && jsonData[channel.id].channeladmin)) return interaction.reply({ embeds: [ embed(`Bu işlemi sadece \`kanal sahibi\` veya \`kanal moderatörü\` yapabilir!`,"RED") ], ephemeral:true})

                if (!(member.id === jsonData[channel.id].channeladmin || jsonData[channel.id].channelmod.includes(member.id))) return interaction.reply({ embeds: [ embed(`Bu işlemi sadece kanal sahibi veya kanal moderatörü yapabilir.`,"RED") ], ephemeral:true})
            }
            //Admin Control
            else if (foundroomcommends === "roomcommendadmin"){
            
                if (!(jsonData[channel.id] && jsonData[channel.id].channeladmin)) return interaction.reply({ embeds: [ embed(`Bu işlemi sadece \`kanal sahibi\` yapabilir!`,"RED") ], ephemeral:true})

                if (!(member.id === jsonData[channel.id].channeladmin)) return interaction.reply({ embeds: [ embed(`Bu işlemi sadece \`kanal sahibi\` yapabilir.`,"RED") ], ephemeral:true})
            
            }
            //Create Control
            else if (foundroomcommends === "roomcommendcreate"){
            
                let found = false;
                let parameterName = '';
        
                for (const parameter in jsonData) {
                if (jsonData.hasOwnProperty(parameter)) {
                    const channelData = jsonData[parameter];
                    if (channelData.channeladmin === member.id) {
                        
                    found = true;
                    parameterName = parameter;
                    break;
                    }
                }
                }
        
                if (found) return interaction.reply({ embeds: [ embed(`Zaten <#${parameterName}> kanalı sizin. Eski kanalı silmeden yeni bir kanal açamazsınız.`,"RED") ], ephemeral: true })

            }
            //Create Writing
            else if (foundroomcommends === "roomcommenddataadd"){
                const newEntry = {
                    channeladmin: member.id,
                    channelmod: []
                };
                jsonData[command.data.privroomchannelid] = newEntry;
                
                const updatedData = JSON.stringify(jsonData, null, 2);
                fs.writeFile(filePath, updatedData, 'utf8', (err) => {
                if (err) {
                    console.error('Dosya yazma hatası:', err);
                    return;
                }
                });      
                return

            }
            //Delete Writing
            else if (command.data.privroomcommands === "roomcommenddatadel"){
    
                if (jsonData.hasOwnProperty(command.data.privroomchannelid)) {
                    delete jsonData[command.data.privroomchannelid];
                }
                
                const updatedData = JSON.stringify(jsonData, null, 2);
                fs.writeFile(filePath, updatedData, 'utf8', (err) => {
                if (err) {
                    console.error('Dosya yazma hatası:', err);
                    return;
                }
                });      
                return
    
            }
            //Delete Mod
            else if (command.data.privroomcommands === "roomcommenddatamoddel"){
    
                if (jsonData[command.data.privroomchannelid]) {
                    const channelmod = jsonData[command.data.privroomchannelid].channelmod;
                    const index = channelmod.indexOf(command.data.privroomdeletemodid);
              
                    if (index !== -1) {
                      channelmod.splice(index, 1);
                    }
                }
                
                const updatedData = JSON.stringify(jsonData, null, 2);
                fs.writeFile(filePath, updatedData, 'utf8', (err) => {
                if (err) {
                    console.error('Dosya yazma hatası:', err);
                    return;
                }
                });      
                return
    
            }
            //Add Mod
            else if (command.data.privroomcommands === "roomcommenddatamodadd"){
    
                if (jsonData[command.data.privroomchannelid]) {
                    const channelmod = jsonData[command.data.privroomchannelid].channelmod;
                    const index = channelmod.indexOf(command.data.privroomaddmodid);
                    
                    if (index === -1) {
                      channelmod.push(command.data.privroomaddmodid);
                    }
                  }
                  
                  const updatedData = JSON.stringify(jsonData, null, 2);
                  fs.writeFile(filePath, updatedData, 'utf8', (err) => {
                    if (err) {
                      console.error('Dosya yazma hatası:', err);
                      return;
                    }
                  });
                  return
    
            }
            //Edit Admin
            else if (command.data.privroomcommands === "roomcommenddataadminedit"){
    
                if (jsonData[command.data.privroomchannelid]) {
                    const channel = jsonData[command.data.privroomchannelid];
                    channel.channeladmin = command.data.privroomeditownerid;
                }
                  
                  const updatedData = JSON.stringify(jsonData, null, 2);
                  fs.writeFile(filePath, updatedData, 'utf8', (err) => {
                    if (err) {
                      console.error('Dosya yazma hatası:', err);
                      return;
                    }
                  });
                  return
    
            }
    
            //Hata Control
            else {
                return interaction.reply({ embeds: [ embed(`Bu komutu kullanırken bir hata oluştu.(Hata Control[f:priwrooms_control1])`,"RED") ]})
            }
            // Owner Control Execute
            if (found && command.data.priroomguard && command.data.priroomguard === "owner") return command.data.execute(interaction, parameterName, foundchannedownerid)
            
            // Normal Execute
            if (found) return command.data.execute(interaction, parameterName)
        }   
        // noButton or noSelectMenu Control
        const logroomcntrl = (interaction.channel && interaction.channel.id !== process.env.roomlogchannel)


        if(command.data.roomsizethendelete !== "roomsizethendelete" && interaction.type !== "DEFAULT" && !interaction.isButton() && !interaction.isSelectMenu() && !interaction.isModalSubmit() && logroomcntrl){
            if (!interaction.isContextMenu()){
                return interaction.reply({ embeds: [ embed(`Bu komutu sadece <#${process.env.roomlogchannel}> kanalında kullanabilirsin.`,"RED") ], ephemeral:true})
            }            
        }

        // Mod Control
        else if(command.data.privroomcommands === "roomcommendmod" && logroomcntrl){
            if (!(jsonData[channel.id] && jsonData[channel.id].channeladmin)) return interaction.reply({ embeds: [ embed(`Bu işlemi sadece \`kanal sahibi\` veya \`kanal moderatörü\` yapabilir!`,"RED") ], ephemeral:true})

            if (!(member.id === jsonData[channel.id].channeladmin || jsonData[channel.id].channelmod.includes(member.id))) return interaction.reply({ embeds: [ embed(`Bu işlemi sadece \`kanal sahibi\` veya \`kanal moderatörü\` yapabilir.`,"RED") ], ephemeral:true})
        }
        //Admin Control
        else if (command.data.privroomcommands === "roomcommendadmin" && logroomcntrl){
        
            if (!(jsonData[channel.id] && jsonData[channel.id].channeladmin)) return interaction.reply({ embeds: [ embed(`Bu işlemi sadece \`kanal sahibi\` yapabilir!`,"RED") ], ephemeral:true})

            if (!(member.id === jsonData[channel.id].channeladmin)) return interaction.reply({ embeds: [ embed(`Bu işlemi sadece \`kanal sahibi\` yapabilir.`,"RED") ], ephemeral:true})
        
        }
        //Create Control
        else if (command.data.privroomcommands === "roomcommendcreate"){
        
            let found = false;
            let parameterName = '';
      
            for (const parameter in jsonData) {
              if (jsonData.hasOwnProperty(parameter)) {
                const channelData = jsonData[parameter];
                if (channelData.channeladmin === member.id) {
                    
                  found = true;
                  parameterName = parameter;
                  break;
                }
              }
            }
      
            if (found) return interaction.reply({ embeds: [ embed(`Zaten <#${parameterName}> kanalı sizin. Eski kanalı silmeden yeni bir kanal açamazsınız.`,"RED") ], ephemeral: true })

        }
        //Create Writing
        else if (command.data.privroomcommands === "roomcommenddataadd"){
            const newEntry = {
                channeladmin: member.id,
                channelmod: []
            };
            jsonData[command.data.privroomchannelid] = newEntry;
            
            const updatedData = JSON.stringify(jsonData, null, 2);
            fs.writeFile(filePath, updatedData, 'utf8', (err) => {
            if (err) {
                console.error('Dosya yazma hatası:', err);
                return;
            }
            });      
            return

        }
        //Delete Writing
        else if (command.data.privroomcommands === "roomcommenddatadel"){

            if (jsonData.hasOwnProperty(command.data.privroomchannelid)) {
                delete jsonData[command.data.privroomchannelid];
            }
            
            const updatedData = JSON.stringify(jsonData, null, 2);
            fs.writeFile(filePath, updatedData, 'utf8', (err) => {
            if (err) {
                console.error('Dosya yazma hatası:', err);
                return;
            }
            });      
            return

        }
        //Delete Mod
        else if (command.data.privroomcommands === "roomcommenddatamoddel"){

            if (jsonData[command.data.privroomchannelid]) {
                const channelmod = jsonData[command.data.privroomchannelid].channelmod;
                const index = channelmod.indexOf(command.data.privroomdeletemodid);
          
                if (index !== -1) {
                  channelmod.splice(index, 1);
                }
            }
            
            const updatedData = JSON.stringify(jsonData, null, 2);
            fs.writeFile(filePath, updatedData, 'utf8', (err) => {
            if (err) {
                console.error('Dosya yazma hatası:', err);
                return;
            }
            });      
            return

        }
        //Add Mod
        else if (command.data.privroomcommands === "roomcommenddatamodadd"){

            if (jsonData[command.data.privroomchannelid]) {
                const channelmod = jsonData[command.data.privroomchannelid].channelmod;
                const index = channelmod.indexOf(command.data.privroomaddmodid);
                
                if (index === -1) {
                  channelmod.push(command.data.privroomaddmodid);
                }
              }
              
              const updatedData = JSON.stringify(jsonData, null, 2);
              fs.writeFile(filePath, updatedData, 'utf8', (err) => {
                if (err) {
                  console.error('Dosya yazma hatası:', err);
                  return;
                }
              });
              return

        }
        //Edit Admin
        else if (command.data.privroomcommands === "roomcommenddataadminedit"){

            if (jsonData[command.data.privroomchannelid]) {
                const channel = jsonData[command.data.privroomchannelid];
                channel.channeladmin = command.data.privroomeditownerid;
            }
              
              const updatedData = JSON.stringify(jsonData, null, 2);
              fs.writeFile(filePath, updatedData, 'utf8', (err) => {
                if (err) {
                  console.error('Dosya yazma hatası:', err);
                  return;
                }
              });
              return

        }

        //Hata Control
        else {
            if (logroomcntrl) return interaction.reply({ embeds: [ embed(`Bu komutu kullanırken bir hata oluştu.(f:privrooms_control2)`,"RED") ]})
        }


        //return
        //Ececute Command
        try{
            command.data.execute(interaction)
        } catch(e){
            interaction.reply({ embeds: [ embed(`Bu komutu kullanırken bir hata oluştu.`,"RED") ] })
            console.log(e)
        }        

    });
    

}
