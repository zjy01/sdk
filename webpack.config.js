module.exports = {
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel-loader?'+JSON.stringify({presets:['react','es2015']}),
      exclude: /node_modules/,
      include: __dirname
    }]
  }
};
