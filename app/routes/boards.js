function viewHomepage(req, res) {
  res.render('whiteboard.html', {
    currentUser: req.session.user.username
  })
}

module.exports = (app, UserWhiteboardRelationship, Stroke, Postit) => {
  app.get('/board/home', function(req, res) {
    if (req.session.user) {
      viewHomepage(req, res)
    } else {
      res.redirect('/welcome')
    }
  })

  app.get('/board/:board', function(req, res) {
    if (req.session.user) {
      viewHomepage(req, res)
    } else {
      res.redirect('/welcome')
    }
  })

  app.post('/addboard', function(req, res) {
    UserWhiteboardRelationship.find({ $and:
      [{ userID: req.session.user.username },
      { whiteboardID: req.body.whiteboardID }]
    }).then( function(existingFavourite) {
      if (existingFavourite[0]) {
        res.send()
      } else {
        var relationship = new UserWhiteboardRelationship({
          whiteboardID: req.body.whiteboardID,
          userID: req.session.user.username
        })
        relationship.save();
        res.send();
      }
    })
  })

  app.post('/search', function(req, res) {
    res.redirect('/board/' + req.body.search);
  })

  app.get('/clear-whiteboard', function(req, res) {
    Stroke.remove({ whiteboardID: req.query.board }, function(){} ).then( function() {
      res.send('Strokes cleared!')
    })
    Postit.remove({ whiteboardID: req.query.board }, function(){}).then( function() {
      res.send('Postits cleared!')
    })
  });

  app.get('/loadRelationships', function(req, res) {
    var userID = req.query.userID
    UserWhiteboardRelationship.find({ userID: userID }, function(e, data){} ).then( function(data) {
      res.send(data);
    })
  })

  app.get('/clearBoards', function(req, res) {
    UserWhiteboardRelationship.remove({ userID: req.query.userID }, function(){} ).then( function() {
      res.send('Favourites cleared!')
    })
  })
}
