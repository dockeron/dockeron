'use strict'

import { app, BrowserWindow } from 'electron'
import setIpcChannels from './setIpcChannels'
import ElectronConstants from '../renderer/js/constants/ElectronConstants'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

setIpcChannels()

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 600,
    // transparent: true,
    titleBarStyle: 'hidden',
    width: 1000
  })

  mainWindow.loadURL(winURL)

  mainWindow.on(ElectronConstants.BROWSER_WINDOW_EVENT_CLOSED, () => {
    mainWindow = null
  })
}

app.on(ElectronConstants.APP_EVENT_READY, createWindow)

app.on(ElectronConstants.APP_EVENT_WINDOW_ALL_CLOSED, () => {
  if (process.platform !== ElectronConstants.PLATFORM_DARWIN) {
    app.quit()
  }
})

app.on(ElectronConstants.APP_EVENT_ACTIVATE, () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
