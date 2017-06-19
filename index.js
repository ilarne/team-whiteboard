const express = require('express')
const app = express()
// const whiteboard = require('whiteboard.js')
app.use(express.static('public'))

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/whiteboard.html')
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
