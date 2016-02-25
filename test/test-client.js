var test = require('tape')

var SOCKET_SERVER = 'wss://echo.websocket.org'

require('./basic')(SOCKET_SERVER, test)
require('./stream')(SOCKET_SERVER, test)
