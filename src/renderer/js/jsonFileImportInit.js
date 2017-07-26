import fs from 'fs'
import path from 'path'
import { ipcRenderer } from 'electron'
import notify from './notify'
import { IPC_CHANNEL_SELECTED_DIRECTORY } from './constants/ElectronConstants'

function jsonFileImportInit (callback) {
  ipcRenderer.on(IPC_CHANNEL_SELECTED_DIRECTORY, function (event, filePaths) {
    if (filePaths.length !== 1) {
      notify('You should select and ONLY SELECT ONE file!')
      return
    }

    var filePath = filePaths[0]
    try {
      if (path.extname(filePath) !== '.json') {
        notify('Not a .json file!')
        return
      }

      fs.readFile(filePath, callback)
    } catch (e) {
      notify(e)
    }
  })
}

export default jsonFileImportInit
