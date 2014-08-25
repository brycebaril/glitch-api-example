var nconf = require('nconf')
var bodyParser = require('body-parser')
var dataUriToBuffer = require('data-uri-to-buffer')
var readimage = require("readimage")
var writegif = require("writegif")
var glitch = require('./glitch')
var express = require('express')
var app = express()

nconf.argv().env().file({ file: 'local.json'})

app.use(bodyParser.json({limit: '5mb'}))
app.use(express.static(__dirname + '/public'))

var err404 = require("fs").readFileSync("public/img/404.gif")
var errUri = "data:image/gif;base64," + err404.toString("base64")

function sendErr(req, res) {
  req.body.content.data = errUri
  req.body.content.type = "image/gif"
  return res.json(req.body)
}

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
    if ((image.height * image.width * image.frames.length) > 500000) {
      console.log("Aborting! %s * %s * %s = %s > 360000", image.height, image.width, image.frames.length, image.height * image.width * image.frames.length)
      return sendErr(req, res)
    }
    if (err) {
      return sendErr(req, res)
    }
    glitch[alg](image)
    writegif(image, function (err, gif) {
      if (err) {
        return sendErr(req, res)
      }
      var dataUri = 'data:image/gif;base64,' + gif.toString('base64')
      req.body.content.data = dataUri
      req.body.content.type = "image/gif"
      return res.json(req.body)
    })
  })
}

app.post("/:glitch/service", glitchRoute)
app.post("/service", glitchRoute)

app.use(function(err, req, res, next){
  return sendErr(req, res)
});

var port = nconf.get('port')
app.listen(port)
console.log('server running on port: ', port)
