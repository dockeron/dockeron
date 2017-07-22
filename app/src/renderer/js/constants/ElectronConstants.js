
const ElectronConstants = Object.freeze({
  // channels
  IPC_CHANNEL_OPEN_FILE_DIALOG: 'open-file-dialog',
  IPC_CHANNEL_OPEN_SAVE_DIALOG: 'open-save-dialog',
  IPC_CHANNEL_SELECTED_DIRECTORY: 'selected-directory',
  IPC_CHANNEL_SAVED_FILE: 'saved-file',
  // app event
  APP_EVENT_READY: 'ready',
  APP_EVENT_WINDOW_ALL_CLOSED: 'window-all-closed',
  APP_EVENT_ACTIVATE: 'activate',
  // BrowserWindow event
  BROWSER_WINDOW_EVENT_CLOSED: 'closed',
  BROWSER_WINDOW_EVENT_CLOSE: 'close',
  // others
  NOTIFICATION_TITLE_DOCKERON: 'Dockeron'
})

export default ElectronConstants
