'use strict'

import { ipcMain, dialog } from 'electron'
import * as ElectronConstants from '../renderer/js/constants/ElectronConstants'

export default function setIpcChannels () {
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
}
