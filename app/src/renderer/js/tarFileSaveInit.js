import { ipcRenderer } from 'electron'
import notify from './notify'

function tarFileSaveInit (callback) {
  ipcRenderer.on('saved-file', function (event, path) {
    if (!path) {
      notify('File path is empty!')
      callback({message: 'File path is empty!'}, path)
    } else {
      callback(null, path)
    }
  })
}

export default tarFileSaveInit
