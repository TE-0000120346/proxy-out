var http = require('http'),
    https = require('https'),
    url = require('url'),
    tunnel = require('tunnel');
 
var _httpRequest = http.request;
var _httpsRequest = https.request;

var _proxy = {
  port: 80,
  protocol: 'http:' 
};
var _rejectUnauthorized = false;
var _httpsTunnelingAgent, _httpTunnelingAgent;

var _wrapRequest = function (options, callback, isHttps) {
    // Parse destination URL
    if ('string' === typeof options) {
      var parsed = url.parse(options);

      options = {
        host:     parsed.host,
        path:     parsed.path,
        port:     parsed.port     || 80,
        protocol: parsed.protocol || 'http:'
      };

      if(options.protocol === 'https:' && !parsed.port) {
        options.port = 443;
      } 
    }

    // Call the original request
    if (isHttps) {
      options.agent = _httpsTunnelingAgent;
      options.rejectUnauthorized = false;
      return _httpsRequest(options, callback);
    } else {
      options.agent = _httpTunnelingAgent;
      return _httpRequest(options, callback);
    }
};

http.request = function(options, callback) {
    if (options && options.method === 'CONNECT') {
      return _httpRequest(options, callback);
    } else {
      return _wrapRequest(options, callback, false);
    }
};

https.request = function(options, callback) {
    return _wrapRequest(options, callback, true);
};

http.get = function(options, callback) {
    var req = http.request(options, callback);
    req.end();
    return req;
};

https.get = function(options, callback) {
    var req = https.request(options, callback);
    req.end();
    return req;
};

module.exports = function(proxyUrl, rejectUnauthorized) {
    var parsed = url.parse(proxyUrl);

    _proxy = {
      port:     parsed.port     || _proxy.port,
      protocol: parsed.protocol || _proxy.protocol,
      hostname: parsed.hostname
    };
    
    _httpsTunnelingAgent = tunnel.httpsOverHttp({
      proxy: {
        host: _proxy.hostname,
        port: _proxy.port
      }
    });
    _httpTunnelingAgent = tunnel.httpOverHttp({
      proxy: {
        host: _proxy.hostname,
        port: _proxy.port
      }
    });
    
    if (! (_rejectUnauthorized = rejectUnauthorized)) {
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    }
};

