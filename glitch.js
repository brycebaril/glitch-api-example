var readimage = require("readimage")
var writegif = require("writegif")
var glitcher = require("glitcher")

module.exports = function glitch(buffer, callback) {
  readimage(buffer, function (err, image) {
    glitchify(image, callback)
  })
}


function glitchify(image, callback) {
  if (image.frames.length > 1) {
    image.frames.forEach(function (frame, i) {
      frame.data = glitcher.redBlueOverlay(frame.data)
      if (i % 5 == 0) {
        glitcher.invertRGBA(frame.data)
      }
      if (i % 7 == 0) {
        glitcher.reverseRGBA(frame.data)
      }
    })
  }
  else {
    var copy = glitcher.copy(image.frames[0].data)
    image.frames[0].delay = 1900
    glitcher.invertRGBA(copy)
    glitcher.reverseRGBA(copy)
    image.addFrame(copy, 170)
    var redblue = glitcher.redBlueOverlay(copy)
    image.addFrame(redblue, 200)
    var redblue2 = glitcher.redBlueOverlay(image.frames[0].data)
    image.addFrame(redblue2, 200)
  }
  writegif(image, callback)
}
