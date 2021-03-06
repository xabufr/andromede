var zlib = require('zlib');
var path = require('path');
var fs = require('fs');
var mime = require('mime');

module.exports = function(DOCUMENT_ROOT) {
    "use strict";
    return function(request, response) {
// Remove query strings from uri
        if (request.url.indexOf('?')>-1) {
            request.url = request.url.substr(0, request.url.indexOf('?'));
        }
// Remove query strings from uri
        /*if (request.url == '/') {
            request.url = DIRECTORY_INDEX;
        }*/
        var filePath = DOCUMENT_ROOT + request.url;
        var extname = path.extname(filePath);
        var acceptEncoding = request.headers['accept-encoding'];
        if (!acceptEncoding) {
            acceptEncoding = '';
        }
        fs.exists(filePath, function(exists) {
            if (exists) {
                fs.readFile(filePath, function(error, content) {
                    if (error) {
                        response.writeHead(500);
                        response.end();
                    }
                    else {
                        var raw = fs.createReadStream(filePath);
                        var mimeType = mime.lookup(filePath);
                        if (acceptEncoding.match(/\bdeflate\b/)) {
                            response.writeHead(200, { 'content-encoding': 'deflate', 'content-type': mimeType});
                            raw.pipe(zlib.createDeflate()).pipe(response);
                        } else if (acceptEncoding.match(/\bgzip\b/)) {
                            response.writeHead(200, { 'content-encoding': 'gzip', 'content-type': mimeType });
                            raw.pipe(zlib.createGzip()).pipe(response);
                        } else {
                            response.writeHead(200, {});
                            raw.pipe(response);
                        }
                    }
                });
            }
            else {
                response.writeHead(404);
                response.end();
            }
        });
    }
};
