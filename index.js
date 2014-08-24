var nconf = require('nconf')
var bodyParser = require('body-parser')
var dataUriToBuffer = require('data-uri-to-buffer')
var readimage = require("readimage")
var writegif = require("writegif")
var glitch = require('./glitch')
var express = require('express')
var app = express()

nconf.argv().env().file({ file: 'local.json'})

app.use(bodyParser.json({limit: '2mb'}))
app.use(express.static(__dirname + '/public'))

app.get('/', function(req, res) {
  res.sendFile( __dirname + '/index.html')
})

app.get("/:glitch", function (res, res) {
  res.send("yo")
})

function prepImage(uri, callback) {
  var imgBuff = dataUriToBuffer(uri)
  readimage(imgBuff, callback)
}

function glitchRoute(req, res) {
  var alg = req.params.glitch
  if (alg == null || !glitch[alg]) {
    alg = "random"
  }
  prepImage(req.body.content.data, function (err, image) {
    if (err) {
      return res.error(err)
    }
    glitch[alg](image)
    writegif(image, function (err, gif) {
      var dataUri = 'data:image/gif;base64,' + gif.toString('base64')
      req.body.content.data = dataUri
      req.body.content.type = "image/gif"
      return res.json(req.body)
    })
  })
}

app.post("/:glitch/service", glitchRoute)
app.post("/service", glitchRoute)

var port = nconf.get('port')
app.listen(port)
console.log('server running on port: ', port)
