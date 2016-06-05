// Import the interface to Tessel hardware
var tessel = require('tessel');
// Load the http module to create an http server.
var http = require('http');
var ambientlib = require('ambient-attx4');

var ambient = ambientlib.use(tessel.port['A']);

var ambientIsReady = false
ambient.on('ready', function () { ambientIsReady = true })

// Configure our HTTP server to respond with "Hello from Tessel!" to all requests.
var server = http.createServer(function (request, response) {
    if (ambientIsReady) {
        ambient.getLightLevel( function(err, lightdata) {
          if (err) throw err;
          ambient.getSoundLevel( function(err, sounddata) {
            if (err) throw err;
            // console.log("Light level:", lightdata.toFixed(8), " ", "Sound Level:", sounddata.toFixed(8));

            response.writeHead(200, {"Content-Type": "text/plain"});
            // response.end("Hello from Tessel!\n");
            response.end("Light level:" + lightdata.toFixed(8) + "   Sound Level:" + sounddata.toFixed(8))

          });
        })
    }
    else {
        response.writeHead(200, {"Content-Type": "text/plain"});
        response.end("Ambient not ready!\n");
    }
        

});

// Listen on port 8080, IP defaults to 192.168.1.101. Also accessible through [tessel-name].local
server.listen(8080);

// Put a friendly message in the terminal
console.log("Server running at http://192.168.1.101:8080/");
