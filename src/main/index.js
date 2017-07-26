'use strict'

import { app, BrowserWindow } from 'electron'
import setIPCChannels from './setIPCChannels'
import {
  BROWSER_WINDOW_EVENT_CLOSED,
  APP_EVENT_READY,
  APP_EVENT_WINDOW_ALL_CLOSED,
  APP_EVENT_ACTIVATE,
  PLATFORM_DARWIN
} from '../renderer/js/constants/ElectronConstants'

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

setIPCChannels()

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

  mainWindow.on(BROWSER_WINDOW_EVENT_CLOSED, () => {
    mainWindow = null
  })
}

app.on(APP_EVENT_READY, createWindow)

app.on(APP_EVENT_WINDOW_ALL_CLOSED, () => {
  if (process.platform !== PLATFORM_DARWIN) {
    app.quit()
  }
})

app.on(APP_EVENT_ACTIVATE, () => {
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
