const bindAll = require("lodash/fp/bindAll")
const Controller = require("./controller")

class Router {
  constructor({ clientAccessToken, meshbluConfig }) {
    bindAll(Object.getOwnPropertyNames(Router.prototype), this)
    if (!clientAccessToken) throw new Error("Router: requires clientAccessToken")
    if (!meshbluConfig) throw new Error("Router: requires meshbluConfig")
    this.controller = new Controller({ clientAccessToken, meshbluConfig })
  }

  route(app) {
    app.post("/requests/text", this.controller.textRequest)
  }
}

module.exports = Router
