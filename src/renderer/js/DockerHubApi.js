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
   * This gets information about the current logged in user.
   *
   * @returns {Promise}
   */
  loggedInUser () {
    return new Promise((resolve, reject) => {
      if (!loggedInToken) {
        return reject(new Error('No login token found! Please login() or setLoginToken() to continue!'))
      }

      this.get('user/').then(resolve).catch(reject)
    })
  },

  /**
   * This will set the caching options.
   *
   * @param {{enabled: Boolean, time: Number}} options - the options to set for the caching options
   */
  setCacheOptions (options) {
    if (typeof options.enabled !== 'undefined') {
      cacheEnabled = options.enabled
    }

    if (options.time) {
      cacheTimeSeconds = options.time
    }

    // Clear the cache
    cache = {}
  },

  /**
   * This sets the login token for authenticated Docker Hub requests.
   *
   * @param {String} token - the login token for Docker Hub
   */
  setLoginToken (token) {
    loggedInToken = token
  },

  /**
   * Adds a collaborator to the given repository.
   *
   * @param {String} username - the username to add a collaborator to
   * @param {String} name - the name of the repository to add a collaborator to
   * @param {String} collaborator - the username of the collaborator to add
   * @returns {Promise}
   */
  addCollaborator (username, name, collaborator) {
    return new Promise((resolve, reject) => {
      if (!username || typeof username !== 'string') {
        return reject(new Error('Username must be provided!'))
      }

      if (!name || typeof name !== 'string') {
        return reject(new Error('Repository name must be provided!'))
      }

      if (!collaborator || typeof collaborator !== 'string') {
        return reject(new Error('Collaborator username must be provided!'))
      }

      // Make sure the username/collaborator is all lowercase as per Docker Hub requirements
      this.post(`repositories/${username.toLowerCase()}/${name}/collaborators/`, {user: collaborator.toLowerCase()}).then(resolve).catch(reject)
    })
  },

  /**
   * Gets the details for a given build of a repository.
   *
   * @param {String} username - the username to get the comments for
   * @param {String} name - the name of the repository to get the comments for
   * @param {String} code - the code of the build to get the details for
   * @returns {Promise}
   */
  buildDetails (username, name, code) {
    return new Promise((resolve, reject) => {
      if (!username || typeof username !== 'string') {
        return reject(new Error('Username must be provided!'))
      }

      if (!name || typeof name !== 'string') {
        return reject(new Error('Repository name must be provided!'))
      }

      if (!code || typeof code !== 'string') {
        return reject(new Error('Repository code must be provided!'))
      }

      // Make sure the username is all lowercase as per Docker Hub requirements
      this.get(`repositories/${username.toLowerCase()}/${name}/buildhistory/${code}`).then(resolve).catch(reject)
    })
  },

  /**
   * Get the history of all the builds done for a given repository.
   *
   * @param {String} username - the username to get the build history for
   * @param {String} name - the name of the repository to get the build history for
   * @param {{page: Number, perPage: Number}} [options] - the options for this call
   * @returns {Promise}
   */
  buildHistory (username, name, options) {
    return new Promise((resolve, reject) => {
      if (!username || typeof username !== 'string') {
        return reject(new Error('Username must be provided!'))
      }

      if (!name || typeof name !== 'string') {
        return reject(new Error('Repository name must be provided!'))
      }

      let opt = options
      if (!opt) {
        opt = {page: 1, perPage: 100}
      }

      // Make sure the username is all lowercase as per Docker Hub requirements
      this.get(`repositories/${username.toLowerCase()}/${name}/buildhistory?page_size=${opt.perPage || 100}&page=${opt.page || 1}`, 'results').then(resolve).catch(reject)
    })
  },

  /**
   * Gets the build links for a given repository.
   *
   * @param {String} username - the username to get the comments for
   * @param {String} name - the name of the repository to get the comments for
   * @returns {Promise}
   */
  buildLinks (username, name) {
    return new Promise((resolve, reject) => {
      if (!username || typeof username !== 'string') {
        return reject(new Error('Username must be provided!'))
      }

      if (!name || typeof name !== 'string') {
        return reject(new Error('Repository name must be provided!'))
      }

      // Make sure the username is all lowercase as per Docker Hub requirements
      this.get(`repositories/${username.toLowerCase()}/${name}/links`, 'results').then(resolve).catch(reject)
    })
  },

  /**
   * Gets the build settings for a given repository.
   *
   * @param {String} username - the username to get the comments for
   * @param {String} name - the name of the repository to get the comments for
   * @returns {Promise}
   */
  buildSettings (username, name) {
    return new Promise((resolve, reject) => {
      if (!username || typeof username !== 'string') {
        return reject(new Error('Username must be provided!'))
      }

      if (!name || typeof name !== 'string') {
        return reject(new Error('Repository name must be provided!'))
      }

      // Make sure the username is all lowercase as per Docker Hub requirements
      this.get(`repositories/${username.toLowerCase()}/${name}/autobuild`).then(resolve).catch(reject)
    })
  },

  /**
   * Gets the build trigger for a given repository.
   *
   * @param {String} username - the username to get the comments for
   * @param {String} name - the name of the repository to get the comments for
   * @returns {Promise}
   */
  buildTrigger (username, name) {
    return new Promise((resolve, reject) => {
      if (!username || typeof username !== 'string') {
        return reject(new Error('Username must be provided!'))
      }

      if (!name || typeof name !== 'string') {
        return reject(new Error('Repository name must be provided!'))
      }

      // Make sure the username is all lowercase as per Docker Hub requirements
      this.get(`repositories/${username.toLowerCase()}/${name}/buildtrigger`).then(resolve).catch(reject)
    })
  },

  /**
   * Gets the build trigger history for a given repository.
   *
   * @param {String} username - the username to get the comments for
   * @param {String} name - the name of the repository to get the comments for
   * @returns {Promise}
   */
  buildTriggerHistory (username, name) {
    return new Promise((resolve, reject) => {
      if (!username || typeof username !== 'string') {
        return reject(new Error('Username must be provided!'))
      }

      if (!name || typeof name !== 'string') {
        return reject(new Error('Repository name must be provided!'))
      }

      // Make sure the username is all lowercase as per Docker Hub requirements
      this.get(`repositories/${username.toLowerCase()}/${name}/buildtrigger/history`, 'results').then(resolve).catch(reject)
    })
  },

  /**
   * Gets the collaborators for a repository.
   *
   * @param {String} username - the username to get the collaborators for
   * @param {String} name - the name of the repository to get the collaborators for
   * @returns {Promise}
   */
  collaborators (username, name) {
    return new Promise((resolve, reject) => {
      if (!username || typeof username !== 'string') {
        return reject(new Error('Username must be provided!'))
      }

      if (!name || typeof name !== 'string') {
        return reject(new Error('Repository name must be provided!'))
      }

      // Make sure the username is all lowercase as per Docker Hub requirements
      this.get(`repositories/${username.toLowerCase()}/${name}/collaborators`, 'results').then(resolve).catch(reject)
    })
  },

  /**
   * Gets the comments for a repository.
   *
   * @param {String} username - the username to get the comments for
   * @param {String} name - the name of the repository to get the comments for
   * @param {{page: Number, perPage: Number}} [options] - the options for this call
   * @returns {Promise}
   */
  comments (username, name, options) {
    return new Promise((resolve, reject) => {
      // If no name is passed in, then the user wants an official repository
      let user = username
      let nam = name
      let opt = options
      if (user && !nam && !opt) {
        nam = user
        user = 'library'
        opt = {page: 1, perPage: 100}
      } else if (user && nam && !opt) {
        if (nam instanceof Object) {
          opt = nam
          nam = user
          user = 'library'
        } else {
          opt = {page: 1, perPage: 100}
        }
      }

      // If user is '_' then we're trying to get an official repository
      if (user === '_') {
        user = 'library'
      }

      if (!opt) {
        opt = {page: 1, perPage: 100}
      }

      // Make sure the user is all lowercase as per Docker Hub requirements
      user = user.toLowerCase()

      this.get(`repositories/${user}/${nam}/comments?page_size=${opt.perPage || 100}&page=${opt.page || 1}`, 'results').then(resolve).catch(reject)
    })
  },

  /**
   * Creates a build link for a given repository to the given repository.
   *
   * @param {String} username - the username to create a build link for
   * @param {String} name - the name of the repository to create a build link for
   * @param {String} toRepo - the repo to link this automated build to
   * @returns {Promise}
   */
  createBuildLink (username, name, toRepo) {
    return new Promise((resolve, reject) => {
      if (!username || typeof username !== 'string') {
        return reject(new Error('Username must be provided!'))
      }

      if (!name || typeof name !== 'string') {
        return reject(new Error('Repository name must be provided!'))
      }

      if (!toRepo || typeof toRepo !== 'string') {
        return reject(new Error('Repo to link to must be provided!'))
      }

      let repo = toRepo
      // Check to see if the user provided a username for the to_repo
      if (repo.indexOf('/') === -1) {
        repo = `library/${repo}`
      }

      // If to-repo has '_/' then we're trying to get an official repository
      if (repo.substr(0, 2) === '_/') {
        repo = `library/${repo.substr(2)}`
      }

      // Make sure the username is all lowercase as per Docker Hub requirements
      this.post(`repositories/${username.toLowerCase()}/${name}/links`, {to_repo: repo}).then(resolve).catch(reject)
    })
  },

  /**
   * Creates a build tag for a given repository.
   *
   * @param {String} username - the username to create a build tag for
   * @param {String} name - the name of the repository to create a build tag for
   * @param {Object} details - the details of the build tag
   * @returns {Promise}
   */
  createBuildTag (username, name, details) {
    return new Promise((resolve, reject) => {
      if (!username || typeof username !== 'string') {
        return reject(new Error('Username must be provided!'))
      }

      if (!name || typeof name !== 'string') {
        return reject(new Error('Repository name must be provided!'))
      }

      if (!details || typeof details !== 'object') {
        return reject(new Error('Tag details must be provided!'))
      }

      // Make sure the username is all lowercase as per Docker Hub requirements
      let user = username.toLowerCase()

      // Build our object to post
      let obj = {
        isNew: true,
        namespace: user,
        repoName: name,
        name: details.name || 'latest',
        dockerfile_location: details.dockerfile_location || '/',
        source_type: details.source_type || 'Branch',
        source_name: details.source_name || 'master'
      }

      this.post(`repositories/${user}/${name}/autobuild/tags`, obj).then(resolve).catch(reject)
    })
  },

  /**
   * Creates an automated build.
   *
   * @param {String} username - the username of the automated build to create
   * @param {String} name - the name of the automated build to create
   * @param {Object} details - the details of the new automated build
   * @returns {Promise}
   */
  createAutomatedBuild (username, name, details) {
    return new Promise((resolve, reject) => {
      if (!username || typeof username !== 'string') {
        return reject(new Error('Username must be provided!'))
      }

      if (!name || typeof name !== 'string') {
        return reject(new Error('Repository name must be provided!'))
      }

      if (!details || typeof details !== 'object') {
        return reject(new Error('Details must be provided!'))
      }

      // Make sure the username is all lowercase as per Docker Hub requirements
      let user = username.toLowerCase()

      let obj = {
        name,
        namespace: user,
        active: true,
        dockerhub_repo_name: `${user}/${name}`,
        provider: details.provider,
        vcs_repo_name: details.vcs_repo_name,
        is_private: false
      }

      if (typeof details.is_private === 'boolean') {
        obj.is_private = details.is_private
      }

      if (details.description) {
        obj.description = details.description
      }

      return this.post(`repositories/${user}/${name}/autobuild/`, obj).then(resolve).catch(reject)
    })
  },

  /**
   * Creates a repository.
   *
   * @param {String} username - the username of the repository to create
   * @param {String} name - the name of the repository to create
   * @param {Object} details - the details of the new repository
   * @returns {Promise}
   */
  createRepository (username, name, details) {
    return new Promise((resolve, reject) => {
      if (!username || typeof username !== 'string') {
        return reject(new Error('Username must be provided!'))
      }

      if (!name || typeof name !== 'string') {
        return reject(new Error('Repository name must be provided!'))
      }

      if (!details || typeof details !== 'object') {
        return reject(new Error('Details must be provided!'))
      }

      // Make sure the username is all lowercase as per Docker Hub requirements

      let obj = {
        name,
        namespace: username.toLowerCase()
      }

      if (typeof details.is_private === 'boolean') {
        obj.is_private = details.is_private
      }

      if (details.description) {
        obj.description = details.description
      }

      if (details.full_description) {
        obj.full_description = details.full_description
      }

      return this.post(`repositories/`, obj).then(resolve).catch(reject)
    })
  },

  /**
   * Creates a webhook for the given username and repository.
   *
   * @param {String} username - the username of the repository to create a webhook for
   * @param {String} name - the name of the repository to create a webhook for
   * @param {String} webhookName - the name of webhook to create
   * @returns {Promise}
   */
  createWebhook (username, name, webhookName) {
    return new Promise((resolve, reject) => {
      if (!username || typeof username !== 'string') {
        return reject(new Error('Username must be provided!'))
      }

      if (!name || typeof name !== 'string') {
        return reject(new Error('Repository name must be provided!'))
      }

      if (!webhookName || typeof webhookName !== 'string') {
        return reject(new Error('Webhook name must be provided!'))
      }

      // Make sure the username is all lowercase as per Docker Hub requirements
      return this.post(`repositories/${username.toLowerCase()}/${name}/webhooks/`, {name: webhookName}).then(resolve).catch(reject)
    })
  },

  /**
   * Creates a hook for an existing webhook.
   *
   * @param {String} username - the username of the repository to create a hook for
   * @param {String} name - the name of the repository to create a hook for
   * @param {String} webhookID - the id of the existing webhook to create a hook for
   * @param {String} url - the url of the hook to create
   * @returns {Promise}
   */
  createWebhookHook (username, name, webhookID, url) {
    return new Promise((resolve, reject) => {
      if (!username || typeof username !== 'string') {
        return reject(new Error('Username must be provided!'))
      }

      if (!name || typeof name !== 'string') {
        return reject(new Error('Repository name must be provided!'))
      }

      if (!webhookID || typeof webhookID !== 'number') {
        return reject(new Error('Webhook ID must be provided!'))
      }

      if (!url || typeof url !== 'string') {
        return reject(new Error('URL must be provided!'))
      }

      // Make sure the username is all lowercase as per Docker Hub requirements
      return this.post(`repositories/${username.toLowerCase()}/${name}/webhooks/${webhookID}/hooks/`, {hook_url: url}).then(resolve).catch(reject)
    })
  },

  /**
   * Deletes a build link for a given repository.
   *
   * @param {String} username - the username to delete a build link for
   * @param {String} name - the name of the repository to delete a build link for
   * @param {Number} id - the id of the build link to delete
   * @returns {Promise}
   */
  deleteBuildLink (username, name, id) {
    return new Promise((resolve, reject) => {
      if (!username || typeof username !== 'string') {
        return reject(new Error('Username must be provided!'))
      }

      if (!name || typeof name !== 'string') {
        return reject(new Error('Repository name must be provided!'))
      }

      if (!id) {
        return reject(new Error('Build link id must be provided!'))
      }

      if (typeof id !== 'number' || id < 0) {
        return reject(new Error('Build link id must be a number greater than 0!'))
      }

      // Make sure the username is all lowercase as per Docker Hub requirements
      this.delete(`repositories/${username.toLowerCase()}/${name}/links/${id}`).then(resolve).catch(reject)
    })
  },

  /**
   * Deletes a build tag for a given repository.
   *
   * @param {String} username - the username to delete a build tag for
   * @param {String} name - the name of the repository to delete a build tag for
   * @param {Number} id - the id of the build tag to delete
   * @returns {Promise}
   */
  deleteBuildTag (username, name, id) {
    return new Promise((resolve, reject) => {
      if (!username || typeof username !== 'string') {
        return reject(new Error('Username must be provided!'))
      }

      if (!name || typeof name !== 'string') {
        return reject(new Error('Repository name must be provided!'))
      }

      if (!id) {
        return reject(new Error('Build link id must be provided!'))
      }

      if (typeof id !== 'number' || id < 0) {
        return reject(new Error('Build link id must be a number greater than 0!'))
      }

      // Make sure the username is all lowercase as per Docker Hub requirements
      this.delete(`repositories/${username.toLowerCase()}/${name}/autobuild/tags/${id}`).then(resolve).catch(reject)
    })
  },

  /**
   * Deletes a build tag for a given repository.
   *
   * @param {String} username - the username to delete a collaborator for
   * @param {String} name - the name of the repository to delete a collaborator for
   * @param {String} collaborator - the username of the collaborator to delete
   * @returns {Promise}
   */
  deleteCollaborator (username, name, collaborator) {
    return new Promise((resolve, reject) => {
      if (!username || typeof username !== 'string') {
        return reject(new Error('Username must be provided!'))
      }

      if (!name || typeof name !== 'string') {
        return reject(new Error('Repository name must be provided!'))
      }

      if (!collaborator || typeof collaborator !== 'string') {
        return reject(new Error('Collaborator\'s username must be provided!'))
      }

      // Make sure the username and collaborator is all lowercase as per Docker Hub requirements
      this.delete(`repositories/${username.toLowerCase()}/${name}/collaborators/${collaborator.toLowerCase()}`).then(resolve).catch(reject)
    })
  },

  /**
   * Deletes a repository.
   *
   * @param {String} username - the username of the repository to delete
   * @param {String} name - the name of the repository to delete
   * @returns {Promise}
   */
  deleteRepository (username, name) {
    return new Promise((resolve, reject) => {
      if (!username || typeof username !== 'string') {
        return reject(new Error('Username must be provided!'))
      }

      if (!name || typeof name !== 'string') {
        return reject(new Error('Repository name must be provided!'))
      }

      // Make sure the username is all lowercase as per Docker Hub requirements
      return this.delete(`repositories/${username.toLowerCase()}/${name}/`).then(resolve).catch(reject)
    })
  },

  /**
   * Deletes a tag for the given username and repository.
   *
   * @param {String} username - the username of the repository to delete a tag for
   * @param {String} name - the name of the repository to delete a tag for
   * @param {String} tag - the tag to delete
   * @returns {Promise}
   */
  deleteTag (username, name, tag) {
    return new Promise((resolve, reject) => {
      if (!username || typeof username !== 'string') {
        return reject(new Error('Username must be provided!'))
      }

      if (!name || typeof name !== 'string') {
        return reject(new Error('Repository name must be provided!'))
      }

      if (!tag || typeof tag !== 'string') {
        return reject(new Error('Tag must be provided!'))
      }

      // Make sure the username is all lowercase as per Docker Hub requirements
      return this.delete(`repositories/${username.toLowerCase()}/${name}/tags/${tag}/`).then(resolve).catch(reject)
    })
  },

  /**
   * Deletes a webhook for the given username and repository.
   *
   * @param {String} username - the username of the repository to delete a webhook for
   * @param {String} name - the name of the repository to delete a webhook for
   * @param {Number} webhookID - the ID of webhook to delete
   * @returns {Promise}
   */
  deleteWebhook (username, name, webhookID) {
    return new Promise((resolve, reject) => {
      if (!username || typeof username !== 'string') {
        return reject(new Error('Username must be provided!'))
      }

      if (!name || typeof name !== 'string') {
        return reject(new Error('Repository name must be provided!'))
      }

      if (!webhookID || typeof webhookID !== 'number') {
        return reject(new Error('Webhook ID must be provided!'))
      }

      // Make sure the username is all lowercase as per Docker Hub requirements
      return this.delete(`repositories/${username.toLowerCase()}/${name}/webhooks/${webhookID}/`).then(resolve).catch(reject)
    })
  },

  /**
   * This gets the registry settings for the current logged in user containing information about the number of private repositories used/available.
   *
   * @returns {Promise}
   */
  registrySettings () {
    return new Promise((resolve, reject) => {
      this.loggedInUser()
        .then(user => this.get(`users/${user.username}/registry-settings`))
        .then(resolve)
        .catch(reject)
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
   * Gets the repositories for a user.
   *
   * @param {String} username - the username to get the repositories for
   * @returns {Promise}
   */
  repositories (username) {
    return new Promise((resolve, reject) => {
      if (!username) {
        return reject(new Error('Username must be provided!'))
      }

      // Make sure the username is all lowercase as per Docker Hub requirements
      this.get(`users/${username.toLowerCase()}/repositories`).then(resolve).catch(reject)
    })
  },

  /**
   * Gets the starred repositories for a user.
   *
   * @param {String} username - the username to get the starred repositories for
   * @param {{page: Number, perPage: Number}} [options] - the options for this call
   * @returns {Promise}
   */
  repositoriesStarred (username, options) {
    return new Promise((resolve, reject) => {
      if (!username || typeof username !== 'string') {
        return reject(new Error('Username must be provided!'))
      }

      let opt = options
      if (!opt) {
        opt = {page: 1, perPage: 100}
      }

      // Make sure the username is all lowercase as per Docker Hub requirements
      this.get(`users/${username.toLowerCase()}/repositories/starred?page_size=${opt.perPage || 100}&page=${opt.page || 1}`, 'results').then(resolve).catch(reject)
    })
  },

  /**
   * This sets the details of a build tag for a given users repository.
   *
   * @param {String} username - the username
   * @param {String} name - the name of the repository
   * @param {Number} id - the id of the build tag to save
   * @param {Object} details - an object with a the new details of the build tag
   * @returns {Promise}
   */
  setBuildTag (username, name, id, details) {
    return new Promise((resolve, reject) => {
      if (!username || typeof username !== 'string') {
        return reject(new Error('Username must be provided!'))
      }

      if (!name || typeof name !== 'string') {
        return reject(new Error('Repository name must be provided!'))
      }

      if (!id) {
        return reject(new Error('id must be provided!'))
      }

      if (typeof id !== 'number' || id <= 0) {
        return reject(new Error('Provided id must be a number greater than 0!'))
      }

      if (!details || typeof details !== 'object') {
        return reject(new Error('Tag details must be provided!'))
      }

          // Build our object to post
      let obj = {
        id,
        name: details.name || 'latest',
        dockerfile_location: details.dockerfile_location || '/',
        source_type: details.source_type || 'Branch',
        source_name: details.source_name || 'master'
      }

      return this.put(`repositories/${username}/${name}/autobuild/tags/${id}`, obj).then(resolve).catch(reject)
    })
  },

  /**
   * This sets the description (short, full, or both) for a given users repository.
   *
   * @param {String} username - the username
   * @param {String} name - the name of the repository
   * @param {Object} descriptions - an object with a full, short, or both properties
   * @returns {Promise}
   */
  setRepositoryDescription (username, name, descriptions) {
    return new Promise((resolve, reject) => {
      if (!username || !name || !descriptions) {
        return reject(new Error('A username and repository name must be passed in as well as the data to set!'))
      }

      if (typeof descriptions !== 'object' || (!descriptions.hasOwnProperty('full') && !descriptions.hasOwnProperty('short'))) {
        return reject(new Error('Passed in descriptions must be an object with full and/or short properties!'))
      }

      let obj = {}

      if (descriptions.full) {
        obj.full_description = descriptions.full
      }

      if (descriptions.short) {
        obj.description = descriptions.short
      }

      return this.patch(`repositories/${username}/${name}`, obj).then(resolve).catch(reject)
    })
  },

  /**
   * This stars a repository for the logged in user.
   *
   * @param {String} username - the username
   * @param {String} name - the name of the repository
   * @returns {Promise}
   */
  starRepository (username, name) {
    return new Promise((resolve, reject) => {
      let user = username
      let nam = name
      if (user && !nam) {
        nam = user
        user = 'library'
      }

      // If username is '_' then we're trying to get an official repository
      if (user === '_') {
        user = 'library'
      }

      // Make sure the username is all lowercase as per Docker Hub requirements
      user = user.toLowerCase()

      return this.post(`repositories/${user}/${nam}/stars/`, {}).then(resolve).catch(reject)
    })
  },

  /**
   * Gets the tags for a repository.
   *
   * @param {String} [username] - the username of the repository to get tags for. If left out or '_' is provided then it will query the official Docker repository with the given name
   * @param {String} name - the name of the repository to get tags for
   * @param {{page: Number, perPage: Number}} [options] - the options for this call
   * @returns {Promise}
   */
  tags (username, name, options) {
    // If no name is passed in, then the user wants an official repository
    let user = username
    let nam = name
    let opt = options
    if (user && !nam && !opt) {
      nam = user
      user = 'library'
      opt = {page: 1, perPage: 100}
    } else if (user && nam && !opt) {
      if (nam instanceof Object) {
        opt = nam
        nam = user
        user = 'library'
      } else {
        opt = {page: 1, perPage: 100}
      }
    }

      // If username is '_' then we're trying to get an official repository
    if (user === '_') {
      user = 'library'
    }

      // Make sure the username is all lowercase as per Docker Hub requirements
    user = user.toLowerCase()

    return this.get(`repositories/${user}/${nam}/tags?page_size=${opt.perPage || 100}&page=${opt.page || 1}`, 'results')
  },

  /**
   * Creates a build tag for a given repository.
   *
   * @param {String} username - the username to create a build tag for
   * @param {String} name - the name of the repository to create a build tag for
   * @param {Object} details - the details of the build tag
   * @returns {Promise}
   */
  triggerBuild (username, name, details) {
    return new Promise((resolve, reject) => {
      if (!username || typeof username !== 'string') {
        return reject(new Error('Username must be provided!'))
      }

      if (!name || typeof name !== 'string') {
        return reject(new Error('Repository name must be provided!'))
      }

      if (!details || typeof details !== 'object') {
        return reject(new Error('Build details must be provided!'))
      }

      // Make sure the username is all lowercase as per Docker Hub requirements
      // Build our object to post
      let obj = {
        dockerfile_location: details.dockerfile_location || '/',
        source_type: details.source_type || 'Branch',
        source_name: details.source_name || 'master'
      }

      this.post(`repositories/${username.toLowerCase()}/${name}/autobuild/trigger-build`, obj).then(resolve).catch(reject)
    })
  },

  /**
   * This unstars a repository for the logged in user.
   *
   * @param {String} username - the username
   * @param {String} name - the name of the repository
   * @returns {Promise}
   */
  unstarRepository (username, name) {
    return new Promise((resolve, reject) => {
      let user = username
      let nam = name
      if (user && !nam) {
        nam = user
        user = 'library'
      }

      // If user is '_' then we're trying to get an official repository
      if (user === '_') {
        user = 'library'
      }

      // Make sure the username is all lowercase as per Docker Hub requirements
      user = user.toLowerCase()

      return this.delete(`repositories/${user}/${nam}/stars/`).then(resolve).catch(reject)
    })
  },

  /**
   * Gets the details about a user.
   *
   * @param {String} username - the username to get information about
   * @returns {Promise}
   */
  user (username) {
    return new Promise((resolve, reject) => {
      if (!username) {
        return reject(new Error('Username must be provided!'))
      }

      // Make sure the username is all lowercase as per Docker Hub requirements
      this.get(`users/${username.toLowerCase()}`).then(resolve).catch(reject)
    })
  },

  /**
   * Gets the webhooks for a repository you own.
   *
   * @param {String} username - the username to get the webhooks for
   * @param {String} name - the name of the repository to get the webhooks for
   * @param {{page: Number, perPage: Number}} [options] - the options for this call
   * @returns {Promise}
   */
  webhooks (username, name, options) {
    return new Promise((resolve, reject) => {
      if (!username || typeof username !== 'string') {
        return reject(new Error('Username must be provided!'))
      }

      if (!name || typeof name !== 'string') {
        return reject(new Error('Repository name must be provided!'))
      }

      let opt = options
      if (!opt) {
        opt = {page: 1, perPage: 100}
      }

      // Make sure the username is all lowercase as per Docker Hub requirements
      this.get(`repositories/${username.toLowerCase()}/${name}/webhooks?page_size=${opt.perPage || 100}&page=${opt.page || 1}`, 'results').then(resolve).catch(reject)
    })
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
   * Makes a raw delete request to the Docker Hub API.
   *
   * @param {String} path - the path to fetch
   * @param {String} [extract] - the name of the property in the resulting JSON to extract. If left blank it will return the entire JSON
   * @returns {Promise}
   */
  delete (path) {
    return new Promise((resolve, reject) => {
      request(this.requestParams('delete', path), err => {
        if (err) {
          return reject(err)
        }

        return resolve()
      })
    })
  },

  /**
   * Makes a raw patch request to the Docker Hub API.
   *
   * @param {String} path - the path to fetch
   * @param {Object} data - the data to send
   * @param {String} [extract] - the name of the property in the resulting JSON to extract. If left blank it will return the entire JSON
   * @returns {Promise}
   */
  patch (path, data, extract) {
    return new Promise((resolve, reject) => {
      if (!data || typeof data !== 'object') {
        return reject(new Error('Data must be passed to all PATCH requests in the form of an object!'))
      }

      request(this.requestParams('patch', path, data), (err, res, body) => {
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
   * Makes a raw put request to the Docker Hub API.
   *
   * @param {String} path - the path to fetch
   * @param {Object} data - the data to send
   * @param {String} [extract] - the name of the property in the resulting JSON to extract. If left blank it will return the entire JSON
   * @returns {Promise}
   */
  put (path, data, extract) {
    return new Promise((resolve, reject) => {
      if (!data || typeof data !== 'object') {
        return reject(new Error('Data must be passed to all PUT requests in the form of an object!'))
      }

      request(this.requestParams('put', path, data), (err, res, body) => {
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
