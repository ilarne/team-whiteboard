const mongoose = require('mongoose');
const mongo = require('mongodb');
const config = require('./config.js').get(process.env.NODE_ENV);

const Schema = mongoose.Schema;

mongoose.connect(config.database)
const db = mongoose.connection;

const userSchema = new Schema({
  name: String,
  username: String,
  email: String,
  password: String
})

const strokeSchema = new Schema({
  clickX: Array,
  clickY: Array,
  colour: String,
  fontSize: Number,
  whiteboardID: String,
  userID: String
})

const relationshipSchema = new Schema({
  userID: String,
  whiteboardID: String
})

const User = mongoose.model('User', userSchema)
const Stroke = mongoose.model('Stroke', strokeSchema);
const Relationship = mongoose.model('Relationship', relationshipSchema);

module.exports = {
  User: User,
  Stroke: Stroke,
  Relationship: Relationship
}
