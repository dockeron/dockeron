
function notify (body) {
  /* eslint-disable no-new */
  new Notification('Dockeron', {
    body: body
  })
}

export default notify
