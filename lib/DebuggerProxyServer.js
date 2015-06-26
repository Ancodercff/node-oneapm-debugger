"use strict";

/**
 * Created by yan on 15-6-26.
 */

var net = require('net');
var Protocol = require('_debugger').Protocol;
var Server = net.Server;
var util = require('util');

util.inherits(DebuggerProxyServer, Server);

/**
 *
 * @param targetPort {Number}
 * @returns {DebuggerProxyServer}
 *
 * @constructor
 */
function DebuggerProxyServer(targetPort) {
  if (!(this instanceof DebuggerProxyServer)) {
    return new DebuggerProxyServer();
  }
  Server.call(this);

  this.targetPort = targetPort;

  var self = this;

  this.on('connection', function (debugClient) {
    var debugProtocol = new Protocol();
    var targetProtocol = new Protocol();

    debugProtocol.onResponse = function (res) {
      self.emit('message', res);
    };

    targetProtocol.onResponse = function (res) {
      self.emit('message', res);
    };

    var target = net.connect(targetPort, function () {
      debugClient.on('data', function (buf) {
        debugProtocol.execute(buf);
        target.write(buf);
      });

      target.on('data', function (buf) {
        targetProtocol.execute(buf);
        debugClient.write(buf);
      });
    });

    // when debugClient closes
    debugClient.on('close', function () {
      target.destroy();
      target = null;
      debugProtocol = null;
      targetProtocol = null;
    });

  });
}

module.exports = DebuggerProxyServer;
