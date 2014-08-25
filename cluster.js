var CM = require("cluster-master")
CM({
  exec: "index.js",
  size: 4
})
