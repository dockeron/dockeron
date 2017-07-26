import { ipcRenderer } from 'electron'
import notify from './notify'
import { IPC_CHANNEL_SAVED_FILE } from './constants/ElectronConstants'

function tarFileSaveInit (callback) {
  ipcRenderer.on(IPC_CHANNEL_SAVED_FILE, function (event, path) {
    if (!path) {
      notify('File path is empty!')
      callback(new Error('File path is empty!'), path)
    } else {
      callback(null, path)
    }
  })
}

export default tarFileSaveInit
