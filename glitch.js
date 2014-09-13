var glitcher = require("glitcher")

var clampcolors = 64
var thresh = 25

module.exports = {
  random: random,
  clamp: clamp,
  glitchclamp: glitchclamp,
  ghost: ghost,
  glitchghost: glitchghost,
  superghost: superghost,
  solarize: solarize,
  flip: flip,
  redblueshift: redblueshift,
  spookify: spookify,
  rbspook: rbspook,
  grayscale: grayscale,
  smear: smear,
  smearchannel: smearchannel,
  pixelshift: pixelshift,
  rowslice: rowslice,
  shadow: shadow,
  aniglitch: aniglitch,
  interleave: interleave,
  rainbow: rainbow,
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

function superghost(image) {
  console.log("superghost")
  allFrames(glitcher.superGhost, image)
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
  allFrames(glitcher.redBlueOverlay, image)
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

function grayscale(image) {
  console.log("grayscale")
  allFrames(glitcher.grayscale, image)
}

function _smear(rgba) {
  glitcher.smear(rgba, (Math.random() * 13 + 4) | 0)
}

function smear(image) {
  console.log("smear")
  image.frames.forEach(function (frame) {
    _smear(frame.data)
  })
}

function _smearchannel(rgba) {
  glitcher.smearChannel(rgba, ((Math.random() * 3) | 0), (Math.random() * 17 + 4) | 0)
}

function smearchannel(image) {
  console.log("smearchannel")
  image.frames.forEach(function (frame) {
    _smearchannel(frame.data)
  })
}

function pixelshift(image) {
  console.log("pixelshift")
  image.frames.forEach(function (frame) {
    glitcher.pixelshift(frame.data, ((Math.random() * image.width) | 0))
  })
}

function rowslice(image) {
  console.log("rowslice")
  image.frames.forEach(function (frame) {
    var box = image.height * image.width
    var max = box * 4
    var val = (Math.random() * (max - box / 5)) + box / 5
    glitcher.rowslice(frame.data, val)
  })
}

function clonechannel(image) {
  console.log("clonechannel")
  var dupe = null
  if (image.frames.length > 1) {
    for (var i = image.frames.length - 1; i > 0; i--) {
      dupe = glitcher.copy(image.frames[i - 1].data)
      glitcher.cloneChannel(dupe, image.frames[i].data, 0)
      if (i - 2 >= 0) {
        dupe = glitcher.copy(image.frames[i - 2].data)
        glitcher.cloneChannel(dupe, image.frames[i].data, 1)
      }
      if (i - 3 >= 0) {
        dupe = glitcher.copy(image.frames[i - 3].data)
        glitcher.cloneChannel(dupe, image.frames[i].data, 2)
      }
    }
  }
  else {
    dupe = glitcher.copy(image.frames[0].data)
    glitcher.invertRGBA(dupe)
    glitcher.cloneChannel(dupe, image.frames[0].data, Math.random() * 3 | 0)
  }
}

function shadow(image) {
  console.log("shadow")
  var dupe = null
  if (image.frames.length > 1) {
    for (var i = image.frames.length - 1; i > 0; i--) {
      dupe = glitcher.copy(image.frames[i - 1].data)
      glitcher.cloneChannel(dupe, image.frames[i].data, 0)
      if (i - 2 >= 0) {
        dupe = glitcher.copy(image.frames[i - 2].data)
        glitcher.cloneChannel(dupe, image.frames[i].data, 1)
      }
      if (i - 3 >= 0) {
        dupe = glitcher.copy(image.frames[i - 3].data)
        glitcher.cloneChannel(dupe, image.frames[i].data, 2)
      }
    }
  }
  else {
    dupe = glitcher.copy(image.frames[0].data)
    glitcher.invertRGBA(dupe)
    glitcher.reverseRGBA(dupe)
    glitcher.cloneChannel(dupe, image.frames[0].data, Math.random() * 3 | 0)
  }
}

function ggllitch(image) {
  var i = {
    height: image.height,
    width: image.width,
    frames: [{data: glitcher.copy(image.frames[0].data)}]
  }
  i.addFrame = function () {}
  random(i)
  return i.frames[0].data
}

function aniglitch(image) {
  console.log("aniglitch")
  if (image.frames.length > 1) {
    for (var i = image.frames.length - 1; i > 0; i--) {
      dupe = glitcher.copy(image.frames[i - 1].data)
      glitcher.cloneChannel(dupe, image.frames[i].data, 0)
      if (i - 2 >= 0) {
        dupe = glitcher.copy(image.frames[i - 2].data)
        glitcher.cloneChannel(dupe, image.frames[i].data, 1)
      }
      if (i - 3 >= 0) {
        dupe = glitcher.copy(image.frames[i - 3].data)
        glitcher.cloneChannel(dupe, image.frames[i].data, 2)
      }
    }
  }
  else {
    glitcher.clampColors(image.frames[0].data, 64)
    image.frames[0].delay = 1200
    image.addFrame(ggllitch(image), 150)
    image.addFrame(ggllitch(image), 150)
  }
}

function interleave(image) {
  console.log("interleave")
  var filters = [
    glitcher.invertRGBA,
    glitcher.reverseRGBA,
    _smear,
    _smearchannel,
    glitcher.ghostColors,
    glitcher.superGhost,
    glitcher.glitchClamp,
    glitcher.grayscale,
    function (rgba) {
      glitcher.pixelshift(rgba, ((Math.random() * image.width) | 0))
    },
    function (rgba) {
      var box = image.height * image.width
      var max = box * 4
      var val = (Math.random() * (max - box / 5)) + box / 5
      glitcher.rowslice(rgba, val)
    }
  ]

  if (image.frames.length > 1) {
    for (var i = image.frames.length - 1; i > 0; i--) {
      var alg = filters[(Math.random() * filters.length) | 0]
      var idx = (i > 1) ? i - 1 : i
      var dupe = alg(glitcher.copy(image.frames[idx].data))
      glitcher.interleave(image.width, image.frames[i].data, dupe)
    }
  }
  else {
    var alg = filters[(Math.random() * filters.length) | 0]
    var dupe = alg(glitcher.copy(image.frames[0].data))
    glitcher.interleave(image.width, image.frames[0].data, dupe)
  }
}

function rainbow(image) {
  console.log("rainbow")
  if (image.frames.length == 1) {
    glitcher.rainbowClamp(image.frames[0].data)
  }
  else {
    glitcher.rainbow(image.frames)
  }
}

function allFrames(algo, image) {
  image.frames.forEach(function (frame) {
    algo(frame.data, clampcolors, thresh)
  })
}
