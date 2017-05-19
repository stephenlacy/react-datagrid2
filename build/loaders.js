'use strict';

var env = require('./env');

var jsLoaders = [
    env.HOT? 'react-hot-loader': '',
    'babel-loader'
].filter(function(x){
    return !!x
})

module.exports = [
  {
    test: /\.(jsx|js)$/,
    exclude: /node_modules/,
    loaders: jsLoaders
  },
  {
    test: /\.styl$/,
    exclude: /node_modules/,
    loader: 'style-loader!css-loader!autoprefixer-loader!stylus-loader'
  },
  {
    test: /\.css$/,
    exclude: /node_modules/,
    loader: 'style-loader!css-loader!autoprefixer-loader'
  }
]
