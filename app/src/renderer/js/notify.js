import ElectronConstants from './constants/ElectronConstants'

function notify (body) {
  /* eslint-disable no-new */
  new Notification(ElectronConstants.NOTIFICATION_TITLE_DOCKERON, {
    body: body
  })
}

export default notify
