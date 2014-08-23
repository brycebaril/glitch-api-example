var readimage = require("readimage")
var writegif = require("writegif")
var glitcher = require("glitcher")

module.exports.glitch = function (buffer, callback) {
  var algs = [clamp, ghost, spookify]
  glitch(algs[(Math.random() * algs.length) | 0], buffer, callback)
}
module.exports.spookify = function (buffer, callback) {
  glitch(spookify, buffer, callback)
}
module.exports.clamp = function (buffer, callback) {
  glitch(clamp, buffer, callback)
}
module.exports.ghost = function (buffer, callback) {
  glitch(ghost, buffer, callback)
}

function glitch(alg, buffer, callback) {
  readimage(buffer, function (err, image) {
    alg(image, callback)
  })
}

function clamp(image, callback) {
  image.frames.forEach(function (frame) {
    glitcher.clampColors(frame.data, 32)
  })
  writegif(image, callback)
}

function ghost(image, callback) {
  image.frames.forEach(function (frame) {
    glitcher.ghostColors(frame.data, 32)
  })
  writegif(image, callback)
}

function spookify(image, callback) {
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
    glitcher.clampColors(image.frames[0].data, 64)
    var copy = glitcher.copy(image.frames[0].data)
    glitcher.ghostColors(copy, 32)
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
