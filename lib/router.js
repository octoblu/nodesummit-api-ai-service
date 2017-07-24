const bindAll = require("lodash/fp/bindAll")
const Controller = require("./controller")

class Router {
  constructor({ clientAccessToken }) {
    bindAll(Object.getOwnPropertyNames(Router.prototype), this)
    if (!clientAccessToken) throw new Error("Router: requires clientAccessToken")
    this.controller = new Controller({ clientAccessToken })
  }

  route(app) {
    app.post("/requests/text", this.controller.textRequest)
  }
}

module.exports = Router
