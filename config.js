var config = {
  production: {
    session: {
      key: 'the.express.session.id',
      secret: 'something.super.secret'
    },
    database: process.env.MONGOLAB_URI,
  },
  default: {
    session: {
      key: 'the.express.session.id',
      secret: 'something.super.secret'
    },
    database: 'localhost:27017/whiteboardDB',
  }
}

exports.get = function get(env) {
  return config[env] || config.default;
}
