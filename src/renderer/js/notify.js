import { NOTIFICATION_TITLE_DOCKERON } from './constants/ElectronConstants'

function notify (body) {
  /* eslint-disable no-new */
  new Notification(NOTIFICATION_TITLE_DOCKERON, {
    body
  })
}

export default notify
