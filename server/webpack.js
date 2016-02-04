var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('../webpack.config');

new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: true,
  contentBase: config.output.contentBase,
  historyApiFallback: true
}).listen(9001, '127.0.0.1', function(err, result) {
  if (err) {
    console.log(err);
  }

  console.log('Listening at localhost:9001');
});
