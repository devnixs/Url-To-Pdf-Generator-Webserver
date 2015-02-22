/*jslint node: true */
'use strict';
var request = require('request');
var http = require('http');
var url = require('url');
var pdf = require('html-pdf');

var options = {};

var port = process.env.PORT || 3000;

http.createServer(function (req, res) {
	var data = url.parse(req.url,true);
	var finalUrl = data.query.url;
	if(finalUrl!==undefined){
		request(finalUrl, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				console.log('Received!');
				pdf.create(body, options).toStream(function(err, stream) {
					console.log('Done generating');
					res.writeHead(200, {'Content-Type': 'application/pdf'});
					stream.pipe(res);
				});
			}
			else{
				console.log('Something wrong happened',error,response);
			}
		});
	}
	else{
		res.writeHead(404);
		res.end('Not found');
	}
}).listen(port);
console.log('Server running at http://127.0.0.1:'+port);
