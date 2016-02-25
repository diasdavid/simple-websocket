exports = module.exports = Server

var Duplex = require('stream').Duplex
var util = require('util')
var WebSocketServer = require('ws').Server

exports.createServer = function (options, onConnCb) {
  if (typeof options === 'function') {
    onConnCb = options
    options = {}
  }

  var server

  return {
    listen: function (port, callback) {
      server = new WebSocketServer({ port: port }, function () {
        // TODO, if no callback is passed, emit a 'listening' event
        // such as https://nodejs.org/api/net.html#net_event_listening
        callback()
      })
      server.on('connection', function (wsConn) {
        onConnCb(convertToStream(wsConn, options))
      })
    },
    close: function (callback) {
      server.close(callback)
    }
  }
}

function Server () {}

function convertToStream (wsConn, options) {
  function read () {}

  var enforcedOpts = {
    objectMode: false,
    decodeStrings: false,
    allowHalfOpen: false
  }

  options = util._extend(options || {}, enforcedOpts)

  var stream = new Duplex(options)
  stream._read = read
  stream._write = write

  stream.ws = wsConn
  stream.ws.on('message', onWsMessage)
  stream.ws.on('close', onWsClose)
  stream.ws.on('open', onWsOpen)
  stream.ws.on('end', onWsEnd)

  stream.close = stream.ws.close.bind(stream.ws)

  function write (chunk, encoding, cb) {
    if (stream.ws.readyState !== 1) {
      return stream.emit('close')
    }

    try {
      stream.ws.send(chunk, cb)
    } catch (err) {
      cb(err)
    }
  }

  function onWsOpen () {
    stream.emit('open')
  }

  function onWsClose () {
    stream.emit('close')
  }

  function onWsEnd () {
    stream.push(null)
  }

  function onWsMessage (message) {
    stream.push(message)
  }

  return stream
}
