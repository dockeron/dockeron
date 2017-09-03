/*
 * Docker Hub API - https://github.com/RyanTheAllmighty/Docker-Hub-API
 * Copyright (C) 2015 RyanTheAllmighty
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */
'use strict'

import request from 'request'
// import axios from 'axios'
import urljoin from 'url-join'

let apiVersion = 'v2'
let host = 'https://hub.docker.com/'

// const A = axios.create({
//   baseURL: host + apiVersion,
//   timeout: 1000
// })

let cache = {}
let cacheEnabled = true
let cacheTimeSeconds = 300

let loggedInToken = null

export default {
  /**
   * This logs into Docker Hub with the given username and password.
   *
   * You may choose to bypass this by providing a login token directly via the setLoginToken(token) method.
   *
   * @param {String} username - the username of your Docker Hub account
   * @param {String} password - the password for that Docker Hub account
   * @returns {Promise}
   */
  login (username, password) {
    return new Promise((resolve, reject) => {
      if (!username || !password) {
        return reject(new Error('Both username and password must be passed to this function!'))
      }

      this.post('users/login/', {username, password}).then(info => {
        if (!info.token) {
          return reject(new Error('Error logging into Docker Hub! No login token sent back!'))
        }

        loggedInToken = info.token

        return resolve(info)
      }).catch(reject)
    })
  },

  /**
   * Gets the details about a repository.
   *
   * @param {String} [username] - the username of the repository to get information about. If left out or '_' is provided then it will query the official Docker repository with the given name
   * @param {String} name - the name of the repository to get information about
   * @returns {Promise}
   */
  repository (username, name) {
    // If no name is passed in, then the user wants an official repository
    let user = username
    let nam = name
    if (!user && !nam) {
      nam = ''
      user = 'library'
    }

    // If username is '_' then we're trying to get an official repository
    if (user === '_') {
      user = 'library'
    }

    // Make sure the username is all lowercase as per Docker Hub requirements
    user = user.toLowerCase()

    return this.get(`repositories/${user}/${nam}`)
  },

  /**
   * Makes a raw get request to the Docker Hub API.
   *
   * @param {String} path - the path to fetch
   * @param {String} [extract] - the name of the property in the resulting JSON to extract. If left blank it will return the entire JSON
   * @returns {Promise}
   */
  get (path, extract) {
    return new Promise((resolve, reject) => {
      let params = this.requestParams('get', path)

      if (cacheEnabled && cache.hasOwnProperty(params.url)) {
        if (Date.now() >= cache[params.url].expires) {
          delete cache[params.url]
        } else {
          return resolve(cache[params.url].data)
        }
      }

      request(params, (err, res, body) => {
        if (err) {
          return reject(err)
        }

              // If the body has a detail property, it's only because there's an error I've found
        if (body.detail) {
          return reject(new Error(body.detail))
        }

              // If the body has a error property, then it's errored out
        if (body.error) {
          return reject(new Error(body.error))
        }

        if (cacheEnabled) {
          cache[params.url] = {expires: (Date.now() + (cacheTimeSeconds * 1000)), data: body}
        }

        if (extract && body.hasOwnProperty(extract)) {
          return resolve(body[extract])
        }

        return resolve(body)
      })
    })
  },

  /**
   * Makes a raw post request to the Docker Hub API.
   *
   * @param {String} path - the path to fetch
   * @param {Object} data - the data to send
   * @param {String} [extract] - the name of the property in the resulting JSON to extract. If left blank it will return the entire JSON
   * @returns {Promise}
   */
  post (path, data, extract) {
    return new Promise((resolve, reject) => {
      if (!data || typeof data !== 'object') {
        return reject(new Error('Data must be passed to all POST requests in the form of an object!'))
      }

      request(this.requestParams('post', path, data), (err, res, body) => {
        if (err) {
          return reject(err)
        }

        // Some api calls don't return any data
        if (!body) {
          return resolve()
        }

        // If the body has a detail property, it's only because there's an error I've found
        if (body.detail) {
          return reject(new Error(body.detail))
        }

        // If the body has a error property, then it's errored out
        if (body.error) {
          return reject(new Error(body.error))
        }

        if (extract && body.hasOwnProperty(extract)) {
          return resolve(body[extract])
        }

        return resolve(body)
      })
    })
  },

  /**
   * Generates and error checks a request object.
   *
   * @param {String} method - the method of the request
   * @param {String} path - the path to fetch
   * @param {Object} [data] - the data to send
   * @returns {Object}
   */
  requestParams (method, path, data) {
    let url = urljoin(host, apiVersion, path)

    let headers = {}
    if (loggedInToken) {
      headers.Authorization = `JWT ${loggedInToken}`
    }

    let params = {
      method,
      url,
      json: true,
      headers
    }

    if (data) {
      params.body = data
    }

    return params
  }
}
