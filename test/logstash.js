var dgram = require('dgram');
var should = require('should');
var os = require('os');

var logmagic = require('logmagic');
var log = logmagic.local('test.logstash');
var logstashSink = require('../lib/logstash').LogstashSink;


describe('the logstash sink', function() {
  var mockServer,
      logstash;

  function createMockServer(port, processMessage) {
    var server = dgram.createSocket('udp4', processMessage);

    server.bind(port);
    return server;
  }

  before(function() {
    logstash = new logstashSink('test', '127.0.0.1', 19999);

    logmagic.registerSink('logstash', logstash.log.bind(logstash));
    logmagic.route('__root__', logmagic.INFO, 'logstash');
  });

  it('send a udp packet containing valid json', function(done) {
    mockServer = createMockServer(logstash.port, function(data) {
      var obj = JSON.parse(data).message;

      obj.should.have.property('facility', 'test.logstash');
      obj.should.have.property('short_message', 'just a log');
      obj.should.have.property('level', 6);
      obj.should.have.property('host', os.hostname());
      obj.should.have.property('_test', 'foobar');

      done();
    });

    log.info('just a log', {test: 'foobar'});
  });

  afterEach(function() {
    mockServer.close();
  });
});
