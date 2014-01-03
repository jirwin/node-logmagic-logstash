var dgram = require('dgram');
var os = require('os');


/**
 * A logstash sink for logmagic.
 * @param
 */
function LogstashSink(name, host, port) {
  this.name = name;
  this.host = host;
  this.port = port;

  this.client = dgram.createSocket('udp4');
}

LogstashSink.prototype.log = function(module, level, message, obj) {
  var log, msg, buf, attr;

  if (level > 7) {
    level = 7;
  }

  log = {
    facility: module,
    timestamp: Date.now(),
    short_message: message,
    level: level,
    host: os.hostname()
  };

  for (attr in obj) {
    if (obj.hasOwnProperty(attr)) {
      log[attr === 'full_message' ? 'full_message' : '_' + attr] = obj[attr];
    }
  }

  msg = JSON.stringify({message: log});
  buf = new Buffer(msg);

  this.client.send(buf, 0, buf.length, this.port, this.host);
};


exports.LogstashSink = LogstashSink;
