import { ipcMain , dialog} from "electron";
import socket from './socket'


const print = console

export default function (mainWindow, helperWindow){

    //socket processing

    const conn = new socket(mainWindow,12,1448)

    ipcMain.on('connectsocket',function(e){
        print.log("Start connect to socket")
        conn.start()
    })

    ipcMain.on('forceclosesocket',function(e){
        conn.stop()
    })
    ipcMain.on('startsendtochart',function(e){
        conn.resume()
    })
    ipcMain.on('stopsendtochart',function(e){
        conn.pause()
    })
    ipcMain.on('helperipc',function(e,func,message){
        print.log(func)
        helperWindow.webContents.send(func,message)
    })

    //invoke

    ipcMain.handle('showOpenDialog', async (event, prepath) => {
        const result = await dialog.showSaveDialog({
            defaultPath:prepath,
            filters:[{ name: 'Data Sheet', extensions: ['xlsx'] }],
            properties: ['createDirectory','showOverwriteConfirmation']
        })
        return result
      })
}