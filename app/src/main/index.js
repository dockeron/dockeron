'use strict'

import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import ElectronConstants from '../renderer/js/constants/ElectronConstants'

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:${require('../../../config').port}`
  : `file://${__dirname}/index.html`

ipcMain.on(ElectronConstants.IPC_CHANNEL_OPEN_FILE_DIALOG, function (event) {
  dialog.showOpenDialog({
    properties: [
      'openFile',
      'openDirectory'
    ]
  }, function (files) {
    if (files) {
      event.sender.send(ElectronConstants.IPC_CHANNEL_SELECTED_DIRECTORY, files)
    }
  })
})

ipcMain.on(ElectronConstants.IPC_CHANNEL_OPEN_SAVE_DIALOG, function (event, path) {
  const options = {
    title: 'Save File',
    defaultPath: path
  }

  dialog.showSaveDialog(options, function (filename) {
    event.sender.send(ElectronConstants.IPC_CHANNEL_SAVED_FILE, filename)
  })
})

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 600,
    width: 1000,
    titleBarStyle: 'hidden'
  })

  mainWindow.loadURL(winURL)

  mainWindow.on(ElectronConstants.BROWSER_WINDOW_EVENT_CLOSED, () => {
    mainWindow = null
  })

  // eslint-disable-next-line no-console
  console.log('mainWindow opened')
}

app.on(ElectronConstants.APP_EVENT_READY, createWindow)

app.on(ElectronConstants.APP_EVENT_WINDOW_ALL_CLOSED, () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on(ElectronConstants.APP_EVENT_ACTIVATE, () => {
  if (mainWindow === null) {
    createWindow()
  }
})
