/*jslint node: true */
'use strict';
var request = require('request');
var http = require('http');
var url = require('url');
var pdf = require('html-pdf');

var options = {};

var port = process.env.PORT || 3000;

var errorMessage = 'Something went wrong and I couldn\'t generate a pdf for this page.\nTry with a lighter page.\n';

http.createServer(function (req, res) {
	var data = url.parse(req.url,true);
	var finalUrl = data.query.url;
	if(finalUrl!==undefined){
		request(finalUrl, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				console.log('Received!');
				pdf.create(body, options).toStream(function(err, stream) {
					console.log('Done generating');
					if(err){
						res.writeHead(500);
						res.end(errorMessage+'Error log:\n'+err);
					} else if(stream){
						res.writeHead(200, {'Content-Type': 'application/pdf'});
						stream.pipe(res);
					}
					else{
						res.writeHead(500);
						res.end(errorMessage);
					}
				});
			}
			else{
				res.writeHead(500);
				res.end(errorMessage+'Error log:\n'+error);
			}
		});
	}
	else{
		res.writeHead(404);
		res.end('Not found');
	}
}).listen(port);
