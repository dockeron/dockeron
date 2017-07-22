import Docker from 'dockerode'
import fs from 'fs'
import { DOCKER_ENGINE_UNIX_SOCKET } from './constants/DockerConstants'

var socket = process.env.DOCKER_SOCKET || DOCKER_ENGINE_UNIX_SOCKET
var stats

try {
  stats = fs.statSync(socket)
  if (!stats.isSocket()) {
    console.warning('Are you sure the docker is running?')
  }
} catch (e) {
  console.warn(e)
}

var docker = new Docker({ socketPath: socket })
console.log(docker)

export default docker
