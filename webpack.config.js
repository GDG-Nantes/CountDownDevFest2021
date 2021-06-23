const path = require('path')

module.exports = {
  // context: __dirname,
  entry: './src/index.js',
  // target: 'node',
  output: {
    path: path.resolve(__dirname),
    filename: './bundle.js',
    sourceMapFilename: 'bundle.js.map',
  },
  // resolve: {
  //   extensions: ['.js']
  // },
  //devtool: 'source-map',
  devtool: 'eval-cheap-source-map',
}
