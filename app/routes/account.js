const session = require('client-sessions');
const flash = require('connect-flash');
const bcrypt = require('bcrypt-nodejs');

module.exports = (app, User) => {
  app.get('/', function(req, res) {
    res.redirect('/board/home')
  })

  app.post('/user/new', function(req, res) {
    User.find(
      {$or:[{'username': req.body.username}, {'email': req.body.email }]}
    ).then( function(existingUser) {
      if (existingUser[0]) {
        req.flash('info', 'Username or email already exists')
        res.redirect('/')
      } else {
        var hash = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
        var user = new User({
          name: req.body.name,
          username: req.body.username,
          email: req.body.email,
          password: hash
        });
        req.session.user = user;
        user.save();
        req.flash('info', 'Welcome to your board!')
        res.redirect('/board/' + user.username);
      }
    })
  })

  app.post('/user/login', function(req, res) {
    var password = req.body.password;

    User.find({ username: req.body.username }, function(e, user) {
      user = user[0];
      if (user === undefined) {
        req.flash('info', 'Sorry, those login details are invalid. Please try again!')
        res.redirect('/')
      } else {
        var result = bcrypt.compareSync(password, user.password);
        if (result == true) {
          req.session.user = user;
          res.redirect('/');
        } else {
          req.flash('info', 'Sorry, that password is not right. Please try again!')
          res.redirect('/');
        };
      }
    });
  });

  app.get('/logout', function(req, res) {
    req.session.reset();
    res.redirect('/');
  });
}
