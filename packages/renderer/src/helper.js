const {ipcRenderer } = require('electron');
const { writeFile } = require('fs/promises');
const ExcelJS  = require('exceljs');


ipcRenderer.on('saveDataToXLSX', async function(e,message){

    let args = JSON.parse(message)
    saveDataToXLSX(args.data,args.path)

})

const saveDataToXLSX = async function(data,path){

    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Zhang Haozhi';
    workbook.lastModifiedBy = 'Zhang Haozhi';
    workbook.created = new Date();
    workbook.modified = new Date();

    const dataSheet = workbook.addWorksheet('Data');
    const settingSheet = workbook.addWorksheet('Setting');

    let cataloags = []
    let maxLength = 0
    let rowTemp = []
    let dataTemp = []

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
        dataSheet.addRow(rowTemp)
    }

    settingSheet.addRow(["Time Offset(UNIX TimeStamp ms)", data.setting.timeOffset])
    settingSheet.addRow(["Time Offset(Real Time)", new Date(data.setting.timeOffset).toLocaleString()])
    settingSheet.addRow(["Voltage Unit", "mV"])

    const buffer = await workbook.xlsx.writeBuffer();
    try{
        await writeFile(path,buffer)
    }catch(e){
        console.error(e)
    }
    
    return   
}