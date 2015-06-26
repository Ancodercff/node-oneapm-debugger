/**
 * Created by yan on 15-6-26.
 */

var assert = require('assert');
var DebuggerProxyServer = require('../').DebuggerProxyServer;

describe('DebugProxyServer', function () {
  it('should be defined ', function () {
    assert.ok(DebuggerProxyServer);
  });

  it('should have the corrent targetPort', function () {
    var p = new DebuggerProxyServer(999);
    assert.equal(p.targetPort, 999);
  });

  it('should be instance of Server', function () {
    var p = new DebuggerProxyServer(5858);
    assert.ok(p instanceof require('net').Server);
  });

  describe('when started', function () {
    it('should trigger the listen callback', function (done) {
      var p = new DebuggerProxyServer(5858);
      p.listen(function () {
        done();
        p.close();
      })
    });
  })
});