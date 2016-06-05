var express = require('express');
var app = express();

if (process.env.NODE_ENV !== 'test') {
    var tessel = require('tessel');
    var ambientlib = require('ambient-attx4');
    var ambient = ambientlib.use(tessel.port['A']);
    var ambientIsReady = false    

    ambient.on('ready', function () {
        ambientIsReady = true
    })
}

app.use('/', express.static(__dirname + '/app'));

app.get('/api/light', function (req, res) {
    if (process.env.NODE_ENV === 'test') {
        res.json({light: Math.random()/10});
        return
    }
    if (ambientIsReady) {
        ambient.getLightLevel( function(err, lightdata) {
            if (err) {
                console.log(err)
                res.status(500);
                res.json({message: 'Something went wrong'})
            }
            else {
                console.log('lightdata: ', lightdata)
                res.json({light: lightdata});
            }
        })
    }
    else {
        res.status(400);
        res.json({message: 'Ambient is not ready'})
    }
});

app.get('/api/sound', function (req, res) {
    if (process.env.NODE_ENV === 'test') {
        res.json({sound: Math.random()/10});
        return
    }
    if (ambientIsReady) {
        ambient.getSoundLevel( function(err, sounddata) {
            if (err) {
                console.log(err)
                res.status(500);
                res.json({message: 'Something went wrong'})
            }
            else {
                console.log('sounddata: ', sounddata)
                res.json({sound: sounddata});
            }
        })
    }
    else {
        res.status(400);
        res.json({message: 'Ambient is not ready'})
    }
});


app.listen(8080, function () {
    console.log('Server running at http://192.168.1.101:8080/');
});
