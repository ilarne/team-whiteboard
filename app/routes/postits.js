module.exports = (app, Postit) => {
  app.get('/loadpostit', function(req, res) {
    Postit.find({ whiteboardID: req.query.whiteboardID }, function(e, data){} ).then( function(data) {
      res.send(data);
    })
  })

  app.post('/createorupdatepostit', function(req, res) {
    Postit.findOne({ postitid: req.body.postitid }).then( function(postit) {
      if (!postit) {
        Postit.create({
          postitid: req.body.postitid,
          text: req.body.text,
          positionX: req.body.positionX,
          positionY: req.body.positionY,
          whiteboardID: req.body.whiteboardID,
          postitclass: req.body.postitClass
        })
      } else {
          postit.text = req.body.text,
          postit.positionX = req.body.positionX,
          postit.positionY = req.body.positionY,
          postit.save();
        }
      }).then( function(data) {
      res.send();
    })
  })
}
