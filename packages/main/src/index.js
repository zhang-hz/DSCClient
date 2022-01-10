import { app, BrowserWindow, shell } from 'electron';
import { join } from 'path';
import { URL } from 'url';
import ipc from './ipc';



const isSingleInstance = app.requestSingleInstanceLock();
const isDevelopment = import.meta.env.MODE === 'development';

const print = console

if (!isSingleInstance) {
    app.quit();
    process.exit(0);
}

//app.disableHardwareAcceleration();

// Install "Vue.js devtools"
if (isDevelopment) {
    app.whenReady()
        .then(() => import('electron-devtools-installer'))
        .then(({ default: installExtension, VUEJS3_DEVTOOLS }) => installExtension(VUEJS3_DEVTOOLS, {
            loadExtensionOptions: {
                allowFileAccess: true,
            },
        }))
        .catch(e => print.error('Failed install extension:', e));
}

//Create MainWindows

let mainWindow = null;
let helperWindow = null;

const createMainWindow = async () => {
    mainWindow = new BrowserWindow({
        width: process.platform == 'darwin'?1200:1198,
        height: 750,
        useContentSize: true,
        show: false,
        webPreferences: {
            nativeWindowOpen: true,
            nodeIntegration: true,
            nodeIntegrationInWorker: true,
            contextIsolation: true,
            webSecurity: false,
            preload: join(__dirname, '../../preload/dist/index.cjs'),
        },
    });

    /**
     * Show Windows
     */
    mainWindow.on('ready-to-show', () => {
        mainWindow?.show();
        if (isDevelopment) {
            mainWindow?.webContents.openDevTools();
        }
    });

    /**
     * URL for main window.
     * Vite dev server for development.
     * `file://../renderer/index.html` for production and test
     */
    const pageUrl = isDevelopment && import.meta.env.VITE_DEV_SERVER_URL !== undefined
        ? import.meta.env.VITE_DEV_SERVER_URL+'index.html'
        : new URL('../renderer/dist/index.html', 'file://' + __dirname).toString();


    await mainWindow.loadURL(pageUrl);


};


const createHelperWindow = async () => {
    helperWindow = new BrowserWindow({
        show: false,
        webPreferences: {
            nodeIntegration: true,
            nodeIntegrationInWorker: true,
            contextIsolation: false,
            webSecurity: false
        },
    });

    /**
     * URL for main window.
     * Vite dev server for development.
     * `file://../renderer/index.html` for production and test
     */

    helperWindow.on('ready-to-show', () => {
        //helperWindow?.show();
        if (isDevelopment) {
            helperWindow?.webContents.openDevTools();
        }
    });


    const pageUrl = isDevelopment && import.meta.env.VITE_DEV_SERVER_URL !== undefined
        ? import.meta.env.VITE_DEV_SERVER_URL+'helper.html'
        : new URL('../renderer/dist/helper.html', 'file://' + __dirname).toString();

    await helperWindow.loadURL(pageUrl);

};

const createIPC = async function(){
    ipc(mainWindow,helperWindow)
}

const handleClose = async function(){
    mainWindow.on('closed',()=>{
        helperWindow.destroy()
    })
}

app.on('web-contents-created', (_event, contents) => {

    /**
     * Block navigation to origins not on the allowlist.
     *
     * Navigation is a common attack vector. If an attacker can convince the app to navigate away
     * from its current page, they can possibly force the app to open web sites on the Internet.
     *
     * @see https://www.electronjs.org/docs/latest/tutorial/security#13-disable-or-limit-navigation
     */
    contents.on('will-navigate', (event, url) => {
        const allowedOrigins =
            new Set(); // Do not use insecure protocols like HTTP. https://www.electronjs.org/docs/latest/tutorial/security#1-only-load-secure-content
        const { origin, hostname } = new URL(url);
        const isDevLocalhost = isDevelopment && hostname === 'localhost'; // permit live reload of index.html
        if (!allowedOrigins.has(origin) && !isDevLocalhost) {
            print.warn('Blocked navigating to an unallowed origin:', origin);
            event.preventDefault();
        }
    });

    /**
    * Hyperlinks to allowed sites open in the default browser.
    *
    * The creation of new `webContents` is a common attack vector. Attackers attempt to convince the app to create new windows,
    * frames, or other renderer processes with more privileges than they had before; or with pages opened that they couldn't open before.
    * You should deny any unexpected window creation.
    *
    * @see https://www.electronjs.org/docs/latest/tutorial/security#14-disable-or-limit-creation-of-new-windows
    * @see https://www.electronjs.org/docs/latest/tutorial/security#15-do-not-use-openexternal-with-untrusted-content
    */
    contents.setWindowOpenHandler(({ url }) => {
        const allowedOrigins =
            new Set([ // Do not use insecure protocols like HTTP. https://www.electronjs.org/docs/latest/tutorial/security#1-only-load-secure-content
                'https://vitejs.dev',
                'https://github.com',
                'https://v3.vuejs.org']);
        const { origin } = new URL(url);
        if (allowedOrigins.has(origin)) {
            shell.openExternal(url);
        } else {
            print.warn('Blocked the opening of an unallowed origin:', origin);
        }
        return { action: 'deny' };
    });
});


app.on('second-instance', () => {
    // Someone tried to run a second instance, we should focus our window.
    if (mainWindow) {
        if (mainWindow.isMinimized()) mainWindow.restore();
        mainWindow.focus();
    }
});


app.on('window-all-closed', () => {
    app.quit();
});


app.whenReady()
    .then(createMainWindow)
    .then(createHelperWindow)
    .then(createIPC)
    .then(handleClose)
    .catch((e) => print.error('Failed create window:', e));


// Auto-updates
if (import.meta.env.PROD) {
    app.whenReady()
        .then(() => import('electron-updater'))
        .then(({ autoUpdater }) => autoUpdater.checkForUpdatesAndNotify())
        .catch((e) => print.error('Failed check updates:', e));
}

