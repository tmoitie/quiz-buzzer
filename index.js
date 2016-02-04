require('babel-register');

require('./server/sockets');

if (process.env.ENV === 'development') {
  require('./server/webpack');
}
