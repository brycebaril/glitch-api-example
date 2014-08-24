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
  grayscale: grayscale,
  smear: smear,
  smearchannel: smearchannel,
  pixelshift: pixelshift,
  rowslice: rowslice,
  shadow: shadow,
  aniglitch: aniglitch,
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

function grayscale(image) {
  console.log("grayscale")
  allFrames(glitcher.grayscale, image)
}

function smear(image) {
  console.log("smear")
  image.frames.forEach(function (frame) {
    glitcher.smear(frame.data, (Math.random() * 13 + 4) | 0)
  })
}

function smearchannel(image) {
  console.log("smearchannel")
  image.frames.forEach(function (frame) {
    glitcher.smearChannel(frame.data, ((Math.random() * 3) | 0), (Math.random() * 17 + 4) | 0)
  })
}

function pixelshift(image) {
  console.log("pixelshift")
  image.frames.forEach(function (frame) {
    frame.data = glitcher.pixelshift(frame.data, ((Math.random() * image.width) | 0))
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

function allFrames(algo, image) {
  image.frames.forEach(function (frame) {
    algo(frame.data, clampcolors)
  })
}
