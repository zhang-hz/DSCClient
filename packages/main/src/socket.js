import net from 'net'
import colfer from "./Colfer.js"

const Colfer = new colfer()
const print = console

export default class socket{
    constructor(win, packageLength, MTU){
        this.socket = null
        this.bufferStorage = new Uint8Array(0)
        this.packageLength = packageLength
        this.MTU = MTU
        this.win = win
        this.sendToChart = false
    }

    start(){    

        let self = this
        this.socket = net.connect({
            host: "192.168.3.1",
            port: 4567,
            onread:{
                buffer:new Uint8Array(50000),
                callback: function(n,buf){

                    self.bufferStorage = concatenate(self.bufferStorage,buf.slice(0,n))
                    
                    if( self.bufferStorage.length >= 43967) {
                        let colfbuf= new Colfer.Colfbuf()
                        try {
                            colfbuf.unmarshal(self.bufferStorage)
                        } catch (error) {
                            print.error(error)
                            self.bufferStorage = new Uint8Array(0) 
                            return
                        }
                        if(self.sendToChart){
                            self.win.webContents.send('socketData',{
                                time:colfbuf.time,
                                time_ns:colfbuf.time_ns,
                                interval:colfbuf.interval,
                                dataLength:colfbuf.datalength,
                                voltage:[colfbuf.directvch0,colfbuf.directvch1,colfbuf.directvch2,colfbuf.directvch3,colfbuf.diffv],
                                heater:[colfbuf.heatervch0, colfbuf.heatervch1, colfbuf.diffheaterv],
                                power:[colfbuf.heaterpch0, colfbuf.heaterpch1, colfbuf.diffheaterp]
                            })
                        }
                        self.bufferStorage = new Uint8Array(0)
                    }
                }
            }
        })

        this.socket.setKeepAlive(true)
        this.socket.on('close',function(){
            if (self.socket.destroy() !== undefined){
                self.socket.destroy()
            }
            self.win.webContents.send('socketstatus','CLOSE')
        })
        this.socket.on('error',function(err){
            print.log(err)
            self.win.webContents.send('socketstatus','ERROR')
        })
    }
    stop(){
        this.win.webContents.send('socketstatus','CLOSE')
        if (this.socket.destroy() !== undefined){
            this.socket.destroy()
        }
        this.socket = null
    }
    pause(){
        this.sendToChart = false
    }
    resume(){
        this.sendToChart = true
    }
}

function concatenate(array1,array2) {

    let totalLength = array1.length + array2.length;
    let result = new Uint8Array(totalLength);
    result.set(array1, 0);
    result.set(array2, array1.length);

    return result;
  }
