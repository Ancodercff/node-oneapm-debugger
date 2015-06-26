"use strict";

/**
 * Created by yan on 15-6-26.
 */

var net = require('net');
var Protocol = require('_debugger').Protocol;
var Server = net.Server;
var util = require('util');

util.inherits(DebuggerProxyServer, Server);

function DebuggerProxyServer(targetPort) {
  if (!(this instanceof DebuggerProxyServer)) {
    return new DebuggerProxyServer();
  }
  Server.call(this);

  this.targetPort = targetPort;

  var self = this;

  this.on('connection', function (c) {
    var protocol = new Protocol();

    protocol.onResponse = function (res) {
      if (res.body && res.body.type) {
        self.emit(res.body.type, res);
      } else {
        self.emit('ready', res);
      }
    };

    var target = net.connect(targetPort, function () {
      c.pipe(target);
      target.pipe(c);

      c.on('data', function (buf) {
        protocol.execute(buf);
      });

      target.on('data', function (buf) {
        protocol.execute(buf);
      });
    });
  });
}

module.exports = DebuggerProxyServer;
