import fs from 'fs'
import path from 'path'
import { ipcRenderer } from 'electron'
import notify from './notify'

function jsonFileImportInit (callback) {
  ipcRenderer.on('selected-directory', function (event, filepaths) {
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
