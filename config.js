var config = {
  production: {
    session: {
      key: 'the.express.session.id',
      secret: 'something.super.secret'
    },
    database: 'mongodb://<user>:<pwd>@apollo.modulusmongo.net:27017/db',
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
