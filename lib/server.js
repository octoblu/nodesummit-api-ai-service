const bindAll = require("lodash/fp/bindAll")
const express = require("express-octoblu")
const MeshbluAuth = require("express-meshblu-auth")
const Router = require("./router")

class Server {
  constructor({ port, clientAccessToken, meshbluConfig }) {
    bindAll(Object.getOwnPropertyNames(Server.prototype), this)
    if (!clientAccessToken) throw new Error("Server: requires clientAccessToken")
    if (!port) throw new Error("Server: requires port")
    if (!meshbluConfig) throw new Error("Server: requires meshbluConfig")
    this.router = new Router({ clientAccessToken })
    this.port = port
    this.meshbluConfig = meshbluConfig
  }

  run(callback) {
    const app = express()
    const meshbluAuth = new MeshbluAuth(this.meshbluConfig)
    app.use(meshbluAuth.auth())
    app.use(meshbluAuth.gateway())
    this.router.route(app)
    this.server = app.listen(this.port, callback)
  }
}

module.exports = Server
