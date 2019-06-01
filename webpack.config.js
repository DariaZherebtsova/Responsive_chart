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
      {
        test: /\.css$/,
        use:
          [
            'style-loader',
            'css-loader',
          ]
      }
    ]
  },
  plugins:[
    new webpack.ProvidePlugin({
     d3_fetch: "d3-fetch/dist/d3-fetch.js",
     d3: "d3/dist/d3.js",
     jQuery: "jquery/dist/jquery.min.js",
     "window.jQuery": "jquery/dist/jquery.min.js",
    })]
};

