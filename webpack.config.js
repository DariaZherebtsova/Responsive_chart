const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'development',	
  entry: './frontend/js/script.js',  
  output: {
	filename: 'build.js',  
    path: path.resolve(__dirname, 'public')    
  },
  module: {
    rules: [
      { test: /\.css$/, use: 'css-loader' },
    ]
  }
};

