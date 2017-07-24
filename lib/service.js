const bindAll = require("lodash/fp/bindAll")
const apiai = require("apiai")
const uuid = require("uuid")
const debug = require("debug")("nodesummit-api-ai-service:ai-service")

class Service {
  constructor({ clientAccessToken }) {
    if (!clientAccessToken) throw new Error("Service: requires clientAccessToken")
    bindAll(Object.getOwnPropertyNames(Service.prototype), this)
    this.app = apiai(clientAccessToken)
  }

  textRequest(query, callback) {
    const request = this.app.textRequest(query, {
      sessionId: uuid.v4(),
    })
    request.on("response", response => {
      debug("got response", JSON.stringify(response, null, 2))
      callback(null, response)
    })
    request.on("error", error => {
      debug("got error response", error)
      callback(error)
    })
    request.end()
  }
}

module.exports = Service
