module.exports = (app, Stroke) => {
  app.post('/newstroke', function(req, res) {
    var stroke = new Stroke({
      clickX: req.body.clickX,
      clickY: req.body.clickY,
      colour: req.body.colour,
      fontSize: req.body.fontSize,
      whiteboardID: req.body.whiteboardID,
      userID: req.session.user.username
    });
    stroke.save();
    res.send();
  })

  app.get('/loadstroke', function(req, res) {
    var whiteboardID = req.query.whiteboardID
    Stroke.find({ whiteboardID: whiteboardID }, function(e, data){} ).then( function(data) {
      res.send(data)
    })
  })

  app.get('/undo', function(req, res) {
    var userID = req.query.userID
    Stroke.findOneAndRemove(Stroke.findOne({userID: userID }).sort({_id:-1})).then( function(stroke) {
      res.send()
    })
  })
}
