var glitch = require("./glitch")
var readimage = require("readimage")
var writegif = require("writegif")
var fs = require("fs")

var input = fs.readFileSync("./input.jpg")

Object.keys(glitch).forEach(function(gl) {
  runGlitch(gl)
  console.log('\n\
  {\n\
    "url": "http://glitch.nothingissacred.org/' + gl + '",\n\
    "description": "' + gl + '",\n\
    "repository": "https://github.com/revisitors/glitcher",\n\
    "sample": "/images/services/' + gl +'.gif"\n\
  },\n')
})

function runGlitch(algo) {
  readimage(input, function (err, image) {
    glitch[algo](image)
    writegif(image, function (err, gif) {
      fs.writeFileSync(algo + ".gif", gif)
    })
  })
}
