import fs from 'fs';

export default (arg) => {
    
    
    let errorStatus = "false"

    if(arg === "roomsdata"){

      fs.readFile("./database/roomsdata.json", 'utf8', (err, data) => {
        if (err) {
            console.error('Dosya okuma hatası:', err);
            errorStatus = "true"    
        }
        if(errorStatus === "true") return console.log("Data okunurken hata çıktı.") 
        let jsonbackupcntrll
        let jsonData
        try{
            jsonData = JSON.parse(data)            
            jsonbackupcntrll = true
        } catch (error) {                      
            jsonbackupcntrll = false
        }

        if(jsonbackupcntrll) {
            fs.readFile('./database/roomsdata.json', 'utf8', (err, data) => {
                if (err) {
                  console.error('Gerçek dosya okunurken bir hata oluştu:', err);
                  return;
                }
              
                fs.writeFile('./database/roomsdatabackup.json', data, 'utf8', (err) => {
                  if (err) {
                    console.error('Gerçek dosya yazılırken bir hata oluştu:', err);
                    return;
                  }
                  console.log('Gerçek dosya başarıyla yedeklendi.');
                });
              });
        } 
        else {
            console.log('data parsellere ayırılamadı.');
        }    
    });

    }

}