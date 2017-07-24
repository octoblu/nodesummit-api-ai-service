const bindAll = require("lodash/fp/bindAll")
const MeshbluHttp = require("meshblu-http")
const Service = require("./service")
const debug = require("debug")("nodesummit-api-ai-service:controller")

class Controller {
  constructor({ clientAccessToken }) {
    bindAll(Object.getOwnPropertyNames(Controller.prototype), this)
    if (!clientAccessToken) throw new Error("Controller: requires clientAccessToken")
    this.clientAccessToken = clientAccessToken
  }

  textRequest(req, res) {
    const { meshbluAuth } = req
    const { query, sessionId, sendTo } = req.body
    const meshbluHttp = new MeshbluHttp(meshbluAuth)
    const clientAccessToken = this.clientAccessToken
    new Service({ clientAccessToken, sessionId }).textRequest(query, (error, response) => {
      if (error) return res.sendError(error)
      const message = {
        devices: [sendTo || "*"],
        topic: "ai-response",
        query,
        sessionId,
        response,
      }
      debug("messaging", message)
      meshbluHttp.message(message, error => {
        if (error) return res.sendError(error)
        res.sendStatus(204)
      })
    })
  }
}

module.exports = Controller
