'use strict'

import { ipcMain, dialog } from 'electron'
import * as ElectronConstants from '../renderer/js/constants/ElectronConstants'

export default function setIpcChannels () {
  ipcMain.on(ElectronConstants.IPC_CHANNEL_OPEN_FILE_DIALOG, event => {
    dialog.showOpenDialog({
      properties: [
        'openFile',
        'openDirectory'
      ]
    }, files => {
      if (files) {
        event.sender.send(ElectronConstants.IPC_CHANNEL_SELECTED_DIRECTORY, files)
      }
    })
  })

  ipcMain.on(ElectronConstants.IPC_CHANNEL_OPEN_SAVE_DIALOG, (event, path) => {
    const options = {
      title: 'Save File',
      defaultPath: path
    }

    dialog.showSaveDialog(options, filename => {
      event.sender.send(ElectronConstants.IPC_CHANNEL_SAVED_FILE, filename)
    })
  })
}
