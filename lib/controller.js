const bindAll = require("lodash/fp/bindAll")
const _ = require("lodash")
const MeshbluHttp = require("meshblu-http")
const Service = require("./service")
const packageJSON = require("../package.json")
const debug = require("debug")("nodesummit-api-ai-service:controller")

const getOptionFromResponse = (key, response) => {
  const messages = _.get(response, "result.fulfillment.messages")
  const message = _.find(messages, message => {
    const type = _.get(message, "payload.type")
    return type === packageJSON.name
  })
  return _.get(message, ["payload", key])
}

class Controller {
  constructor({ clientAccessToken, meshbluConfig }) {
    bindAll(Object.getOwnPropertyNames(Controller.prototype), this)
    if (!clientAccessToken) throw new Error("Controller: requires clientAccessToken")
    if (!meshbluConfig) throw new Error("Controller: requires meshbluConfig")
    this.service = new Service({ clientAccessToken })
    this.meshbluHttp = new MeshbluHttp(meshbluConfig)
  }

  textRequest(req, res) {
    const { uuid } = req.meshbluAuth
    const { message, fromUuid } = req.body
    debug("got text request", req.body, { uuid })
    const sessionId = req.body.sessionId || req.get("x-request-id")
    if (!message) return res.status(422).send({ error: "requires message" })
    if (!fromUuid) return res.status(422).send({ error: "requires fromUuid" })
    this.service.textRequest({ sessionId, message }, (error, response) => {
      if (error) return res.sendError(error)
      const devices = getOptionFromResponse("devices", response)
      const topic = getOptionFromResponse("topic", response)
      if (!devices) return res.status(422).send({ error: "response requires devices" })
      if (!topic) return res.status(422).send({ error: "response requires topic" })
      const message = {
        devices: devices,
        topic: topic,
        requestUuid: fromUuid,
        sessionId,
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
