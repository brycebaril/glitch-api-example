var nconf = require('nconf')
var bodyParser = require('body-parser')
var dataUriToBuffer = require('data-uri-to-buffer')
var glitch = require('./glitch').glitch
var express = require('express')
var app = express()

nconf.argv().env().file({ file: 'local.json'})

app.use(bodyParser.json({limit: '2mb'}))
app.use(express.static(__dirname + '/public'))

app.get('/', function(req, res) {
  res.sendFile( __dirname + '/index.html')
})


app.post('/service', function(req, res) {
  var imgBuff = dataUriToBuffer(req.body.content.data)
  glitch(imgBuff, function (err, gif) {
    if (err) {
      return res.error(err)
    }
    var dataUri = 'data:image/gif;base64,' + gif.toString('base64')
    req.body.content.data = dataUri
    req.body.content.type = "image/gif"
    return res.json(req.body)
  })
})

var port = nconf.get('port')
app.listen(port)
console.log('server running on port: ', port)
