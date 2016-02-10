var config = {
  entry:{
    app:__dirname + "/dynamic/app.js",
    counter:__dirname + "/dynamic/counter.js",
    total:__dirname + "/dynamic/total.js",
    winner:__dirname + "/dynamic/winner.js"
  },

  output:{
    path:__dirname + "/static",
    filename:"[name].js"
  },

  module:{
    loaders:[
      { test:/\.js$/, loaders:["babel-loader"], excludes:/node_modules/ }
    ]
  }
}

module.exports = config
