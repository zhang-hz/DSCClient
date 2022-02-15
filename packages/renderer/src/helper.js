const {ipcRenderer } = require('electron');
const { writeFile , appendFile } = require('fs/promises');
import {stringify} from 'csv-stringify/browser/esm/sync'


ipcRenderer.on('saveDataToCSV', async function(e,message){

    let args = JSON.parse(message)
    saveDataToXLSX(args.data,args.path)

})

const saveDataToXLSX = async function(data,path){

    let cataloags = []
    let maxLength = 0
    let rowTemp = []
    let sheetTemp = []
    let dataTemp = []

    try{
        await writeFile(path,'')
    }catch(e){
        console.error(e)
    }

    for(let key in data.sheet){
        cataloags.push(key)
    }
    for(let catalog of cataloags){
        for(let c = 0; c < data.sheet[catalog].length;c++){
            let channel = [catalog+c.toString(),...data.sheet[catalog][c]]
            dataTemp.push(channel)
            if(channel.length > maxLength){
                maxLength = channel.length
            }
        }
    }

    sheetTemp = []

    for(let i = 0 ;i < maxLength; i++){
        rowTemp = []
        for(let k = 0; k < dataTemp.length; k++){
            if(i == 0){
                if(k == 0){
                    rowTemp.push("time")
                }
                rowTemp.push(dataTemp[k][i])
            }else{
                if(i < dataTemp[k].length ){
                    if(k == 0){
                        rowTemp.push(dataTemp[k][i][0])
                        rowTemp.push(dataTemp[k][i][1])
                    }else{
                        rowTemp.push(dataTemp[k][i][1])
                    }
                    
                }else{
                    rowTemp.push(0)
                }
            }
            
            
        }
        sheetTemp.push(rowTemp)
        if(sheetTemp.length >= 10000){
            try{
                await appendFile(path, stringify(sheetTemp,{delimiter: ','}))
            }catch(e){
                console.error(e)
            }
            sheetTemp = []
        }

    }
    if(sheetTemp.length > 0){
        try{
            await appendFile(path, stringify(sheetTemp,{delimiter: ','}))
        }catch(e){
            console.error(e)
        }
        sheetTemp = []
    }

    return   
}