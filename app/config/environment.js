var config = {
  production: {
    session: {
      key: 'the.express.session.id',
      secret: 'something.super.secret'
    },
    database: 'mongodb://admin:whiteboardtest@ds151082.mlab.com:51082/whiteboardsandbox',
  },
  test: {
    session: {
      key: 'the.express.session.id',
      secret: 'something.super.secret'
    },
    database: 'localhost:27017/testDB',
  },
  default: {
    session: {
      key: 'the.express.session.id',
      secret: 'something.super.secret'
    },
    database: 'localhost:27017/testDB',
  }
}

exports.get = function get(env) {
  return config[env] || config.default;
}
