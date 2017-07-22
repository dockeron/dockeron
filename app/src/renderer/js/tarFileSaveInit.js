import { ipcRenderer } from 'electron'
import notify from './notify'
import ElectronConstants from './constants/ElectronConstants'

function tarFileSaveInit (callback) {
  ipcRenderer.on(ElectronConstants.IPC_CHANNEL_SAVED_FILE, function (event, path) {
    if (!path) {
      notify('File path is empty!')
      callback({message: 'File path is empty!'}, path)
    } else {
      callback(null, path)
    }
  })
}

export default tarFileSaveInit
