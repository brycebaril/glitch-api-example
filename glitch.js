var glitcher = require("glitcher")

var clampcolors = 32

module.exports = {
  random: random,
  clamp: clamp,
  glitchclamp: glitchclamp,
  ghost: ghost,
  glitchghost: glitchghost,
  solarize: solarize,
  flip: flip,
  redblueshift: redblueshift,
  spookify: spookify,
  rbspook: rbspook,
}

function random(image) {
  console.log("random")
  var keys = Object.keys(module.exports)
  var algo = keys[(Math.random() * keys.length) | 0]
  module.exports[algo](image)
}

function clamp(image) {
  console.log("clamp")
  allFrames(glitcher.clampColors, image)
}

function glitchclamp(image) {
  console.log("glitchclamp")
  allFrames(glitcher.glitchClamp, image)
}

function ghost(image) {
  console.log("ghost")
  allFrames(glitcher.ghostColors, image)
}

function glitchghost(image) {
  console.log("glitchghost")
  allFrames(glitcher.glitchGhost, image)
}

function solarize(image) {
  console.log("solarize")
  allFrames(glitcher.invertRGBA, image)
}

function flip(image) {
  console.log("flip")
  allFrames(glitcher.reverseRGBA, image)
}

function redblueshift(image) {
  console.log("redblueshift")
  image.frames.forEach(function (frame) {
    frame.data = glitcher.redBlueOverlay(frame.data)
  })
}

function spookify(image) {
  console.log("spookify")
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
}

function rbspook(image) {
  console.log("rbspook")
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
    image.frames[0].delay = 1200
    var redblue = glitcher.redBlueOverlay(image.frames[0].data)
    image.addFrame(redblue, 100)
    image.addFrame(image.frames[0].data, 50)
    image.addFrame(redblue, 80)
  }
}

function allFrames(algo, image) {
  image.frames.forEach(function (frame) {
    algo(frame.data, clampcolors)
  })
}
