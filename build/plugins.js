'use strict';

var webpack = require('webpack')
var env = require('./env')

module.exports = [
  //needed to supress vertx warning in es6-promise (Promise polyfill)
  new webpack.IgnorePlugin(/vertx/),
  env.HOT && new webpack.HotModuleReplacementPlugin(),
].filter(function(x){
  return !!x
})
