const bindAll = require("lodash/fp/bindAll")
const MeshbluHttp = require("meshblu-http")
const Service = require("./service")
const debug = require("debug")("nodesummit-api-ai-service:controller")

class Controller {
  constructor({ clientAccessToken, meshbluConfig }) {
    bindAll(Object.getOwnPropertyNames(Controller.prototype), this)
    if (!clientAccessToken) throw new Error("Controller: requires clientAccessToken")
    if (!meshbluConfig) throw new Error("Controller: requires meshbluConfig")
    this.clientAccessToken = clientAccessToken
    this.meshbluHttp = new MeshbluHttp(meshbluConfig)
  }

  textRequest(req, res) {
    const { uuid } = req.meshbluAuth
    const { query, sendTo } = req.body
    const sessionId = req.body.sessionId || req.get("x-request-id")
    if (!sendTo) return res.status(422).send({ error: "requires sendTo" })
    if (!query) return res.status(422).send({ error: "requires query" })
    if (!sessionId) return res.status(422).send({ error: "requires sessionId" })
    const clientAccessToken = this.clientAccessToken
    new Service({ clientAccessToken, sessionId }).textRequest(query, (error, response) => {
      if (error) return res.sendError(error)
      const message = {
        devices: [sendTo],
        topic: "ai-response",
        requestUuid: uuid,
        response,
      }
      debug("messaging", message)
      this.meshbluHttp.message(message, error => {
        if (error) return res.sendError(error)
        res.sendStatus(204)
      })
    })
  }
}

module.exports = Controller
