import fs from 'fs'
import path from 'path'
import { ipcRenderer } from 'electron'
import notify from './notify'
import { IPC_CHANNEL_SELECTED_DIRECTORY } from './constants/ElectronConstants'

function jsonFileImportInit (callback) {
  ipcRenderer.on(IPC_CHANNEL_SELECTED_DIRECTORY, function (event, filepaths) {
    // console.log(filepaths)
    if (filepaths.length !== 1) {
      notify('You should select and ONLY SELECT ONE file!')
      return
    }

    var filepath = filepaths[0]
    try {
      if (path.extname(filepath) !== '.json') {
        notify('Not a .json file!')
        return
      }

      fs.readFile(filepath, callback)
    } catch (e) {
      notify(e)
    }
  })
}

export default jsonFileImportInit
