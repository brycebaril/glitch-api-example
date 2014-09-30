var nconf = require('nconf')
var bodyParser = require('body-parser')
var dataUriToBuffer = require('data-uri-to-buffer')
var readimage = require("readimage")
var writegif = require("writegif")
var glitch = require('./glitch')
var express = require('express')
var fs = require("fs")
var app = express()

nconf.argv().env().file({ file: 'local.json'})

app.use(bodyParser.json({limit: '5mb'}))
app.use(express.static(__dirname + '/public', {maxAge: 86400000}))

function toUri(gif) {
  return "data:image/gif;base64," + gif.toString("base64")
}

//var errUri = toUri(fs.readFileSync("public/img/404.gif"))
var eTooBig = toUri(fs.readFileSync("public/img/e_toobig.gif"))
var eTooMany = toUri(fs.readFileSync("public/img/e_toomany.gif"))
var eTooMuch = toUri(fs.readFileSync("public/img/e_toomuch.gif"))


function sendErr(req, res, err, image) {
  if (err) {
    console.log(err)
    console.log(err.stack)
  }
  if (req.body.content == null) {
    req.body.content = {}
  }
  if (image) {
    req.body.content.data = image
  }
  else {
    req.body.content.data = eTooMuch
  }
  req.body.content.type = "image/gif"
  if (req.body.meta == null) {
    req.body.meta = {}
  }
  req.body.meta.error = "Processing error: " + err.message
  return res.json(req.body)
}

app.get('/', function(req, res) {
  console.log("serving /")
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
    console.log("no/unmaged alg %s", alg)
    alg = "random"
  }
  prepImage(req.body.content.data, function (err, image) {
    if (err) {
      return sendErr(req, res, err)
    }
    var start = Date.now()
    console.log("%s Image: %s h %s w %s frames", start, image.height, image.width, image.frames.length)
    if ((image.height * image.width) > 1048576) {
      console.log("Aborting! %s * %s = %s > 1048576", image.height, image.width, image.height * image.width)
      return sendErr(req, res, new Error("oversized > 1048576 pixels"), eTooBig)
    }
    if (image.frames.length > 60) {
      console.log("Aborting! %s > 60", image.frames.length)
      return sendErr(req, res, new Error("too many frames (max 60)"), eTooMany)
    }
    glitch[alg](image)
    writegif(image, function (err, gif) {
      if (err) {
        return sendErr(req, res, err)
      }
      var dataUri = 'data:image/gif;base64,' + gif.toString('base64')
      req.body.content.data = dataUri
      req.body.content.type = "image/gif"
      var end = Date.now()
      console.log("Done: %s (%s)", end, end - start)
      return res.json(req.body)
    })
  })
}

app.post("/:glitch/service", glitchRoute)
app.post("/service", glitchRoute)

app.use(function(err, req, res, next){
  return sendErr(req, res, err)
});

var port = nconf.get('port')
app.listen(port)
console.log('server running on port: ', port)
