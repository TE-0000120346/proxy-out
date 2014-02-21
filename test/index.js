var https = require('https'),
  http = require('http');

require('../proxy-out.js')('http://localhost:8888');

//*
var urls = 'https://www.google.com/';
var reqs = https.get(urls, function(response) {
  var data = '';
  response.on('data', function(body) {
    data += body;
  });
  response.on('end', function() {
    //console.log(data);
    if (data.substring(0, 9) === '<!doctype') {
      console.log('ok');
    } else {
      console.log('ng');
    }
  })
  response.on('error', function(e) {
    console.log('error reqs-response');
    console.log(e);
  });
});
reqs.on('error', function(e) {
  console.log('error reqs');
  console.log(e);
});
//*/

/*
var url = 'http://www.google.com/';
var req = http.get(url, function(response) {
  var data = '';
  response.on('data', function(body) {
    data += body;
  });
  response.on('end', function() {
    console.log(data);
    if (data.substring(0, 9) === '<!doctype') {
      console.log('ok');
    } else {
      console.log('ng');
    }
  })
  response.on('error', function(e) {
    console.log('error req-response');
    console.log(e);
  });
});
req.on('error', function(e) {
  console.log('error req');
  console.log(e);
});
//*/
