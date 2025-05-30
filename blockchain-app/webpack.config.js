const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
require('dotenv').config();

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html'
    }),
    new webpack.DefinePlugin({
      'process.env': {
        CONTRACT_ID: JSON.stringify(process.env.CONTRACT_ID),
        HEDERA_NETWORK: JSON.stringify(process.env.HEDERA_NETWORK)
      }
    }),
    // Provide polyfills for Node.js core modules
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser'
    })
  ],
  resolve: {
    extensions: ['.js', '.jsx'],
    fallback: {
      // Required polyfills
      "stream": require.resolve("stream-browserify"),
      "crypto": require.resolve("crypto-browserify"),
      "os": require.resolve("os-browserify/browser"),
      "path": require.resolve("path-browserify"),
      "zlib": require.resolve("browserify-zlib"),
      "http": require.resolve("stream-http"),
      "https": require.resolve("https-browserify"),
      "url": require.resolve("url"),
      "querystring": require.resolve("querystring-es3"),
      "buffer": require.resolve("buffer/"),
      "assert": require.resolve("assert/"),
      "vm": require.resolve("vm-browserify"),
      
      // Modules we don't need in the browser - set to false
      "fs": false,
      "net": false,
      "tls": false,
      "dns": false,
      "http2": false,
      "async_hooks": false,
      "child_process": false,
      "constants": false
    }
  },
  // Ignore the critical dependency warning in express/lib/view.js
  ignoreWarnings: [
    {
      module: /express\/lib\/view\.js$/,
      message: /the request of a dependency is an expression/
    }
  ]
};