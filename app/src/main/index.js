'use strict'

import { app, BrowserWindow, ipcMain, dialog } from 'electron'

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:${require('../../../config').port}`
  : `file://${__dirname}/index.html`

ipcMain.on('open-file-dialog', function (event) {
  dialog.showOpenDialog({
    properties: [
      'openFile',
      'openDirectory'
    ]
  }, function (files) {
    if (files) {
      event.sender.send('selected-directory', files)
    }
  })
})

ipcMain.on('open-save-dialog', function (event, path) {
  const options = {
    title: 'Save File',
    defaultPath: path
  }

  dialog.showSaveDialog(options, function (filename) {
    event.sender.send('saved-file', filename)
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

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  // eslint-disable-next-line no-console
  console.log('mainWindow opened')
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
