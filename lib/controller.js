const bindAll = require("lodash/fp/bindAll")
const Service = require("./service")

class Controller {
  constructor({ clientAccessToken }) {
    bindAll(Object.getOwnPropertyNames(Controller.prototype), this)
    if (!clientAccessToken) throw new Error("Controller: requires clientAccessToken")
    this.clientAccessToken = clientAccessToken
  }

  textRequest(request, response) {
    const { query } = request.body
    new Service({ clientAccessToken: this.clientAccessToken }).textRequest(query, (error, result) => {
      if (error) return response.sendError(error)
      response.send(result)
    })
  }
}

module.exports = Controller
