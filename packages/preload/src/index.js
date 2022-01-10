import {contextBridge, ipcRenderer } from 'electron';

/**
 * The "Main World" is the JavaScript context that your main renderer code runs in.
 * By default, the page you load in your renderer executes code in this world.
 *
 * @see https://www.electronjs.org/docs/api/context-bridge
 */

/**
 * After analyzing the `exposeInMainWorld` calls,
 * `packages/preload/exposedInMainWorld.d.ts` file will be generated.
 * It contains all interfaces.
 * `packages/preload/exposedInMainWorld.d.ts` file is required for TS is `renderer`
 *
 * @see https://github.com/cawa-93/dts-for-context-bridge
 */

/**
 * Safe expose node.js API
 * @example
 * window.nodeCrypto('data')
 */

contextBridge.exposeInMainWorld('ipcRenderer', {
    send:(channel,data) =>{
        ipcRenderer.send(channel,data)
    },
    on:(channel,func) => {
        ipcRenderer.on(channel,(event, ...args) => func(...args))
    }
});

contextBridge.exposeInMainWorld('dataSaver', {
    excel:(data,path) =>{
        ipcRenderer.send('helperipc','saveDataToXLSX',JSON.stringify({
            data:data,
            path:path
        }))
    },
    selectPath:async (prepath)=>{
        let path = await ipcRenderer.invoke('showOpenDialog',prepath)
        return path
    }
});
