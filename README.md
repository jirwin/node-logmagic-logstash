# node-logmagic-logstash
A sink for logmagic that outputs to logstash via udp.

## install
`$ npm install logmagic-logstash`

## example js
```javascript
var logmagic = require('logmagic');
var log = logmagic.local('test.logstash');
var logstashSink = require('logmagic-logstash').LogstashSink;

// Create a new logstash sink
var logstash = new logstashSink('test', '192.168.1.111', 9999);

// Tell logmagic to route logs to the new logstash sink
logmagic.registerSink('logstash', logstash.log.bind(logstash));
logmagic.route('__root__', logmagic.INFO, 'logstash');

log.error('Just a random log error', {'foo': 'bar', 'baz': 40});
log.info('Just a random log info', {'foo': 'bar', 'baz': 42});
log.debug('Just a random log debug', {'foo': 'bar', 'baz': 12});

```

## logstash config
```
input {
 udp {
  codec => "json"
  type => "nodejs"
  port => 9999
 }
}
output { 
 stdout {
  codec => rubydebug
 }
}
```

## test
`$ npm test`
