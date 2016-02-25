var Socket = require('../')
var test = require('tape')

var SOCKET_PORT = 9876
var SOCKET_SERVER = 'ws://localhost:' + SOCKET_PORT
var server

test('set the server up', function (t) {
  t.plan(1)
  server = Socket.createServer(echo)

  server.listen(SOCKET_PORT, function () {
    t.pass('websockets server is listening')
  })

  function echo (socket) {
    socket.pipe(socket)
  }
})

require('./basic')(SOCKET_SERVER, test)
require('./stream')(SOCKET_SERVER, test)

test('close the server', function (t) {
  t.plan(1)
  server.close(function () {
    t.pass('server closed')
  })
})
