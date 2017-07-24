const bindAll = require("lodash/fp/bindAll")
const express = require("express-octoblu")
const Router = require("./router")

class Server {
  constructor({ port, clientAccessToken }) {
    bindAll(Object.getOwnPropertyNames(Server.prototype), this)
    if (!clientAccessToken) throw new Error("Server: requires clientAccessToken")
    if (!port) throw new Error("Server: requires port")
    this.router = new Router({ clientAccessToken })
    this.port = port
  }

  run(callback) {
    const app = express()
    this.router.route(app)
    this.server = app.listen(this.port, callback)
  }
}

module.exports = Server
