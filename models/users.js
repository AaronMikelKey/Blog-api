const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
  provider: ['facebook', 'twitter', 'google'],
  jwtoken : String,
  local: {
    email: String,
    password: String
  },
  facebook: {
    id:    { type: String, unique: true },
    token: String,
    name:  String,
    email: String
  },
  twitter: {
    id:    { type: String, unique: true },
    token: String,
    name:  String,
    email: String
  },
  google: {
    id:    { type: String, unique: true },
    token: String,
    name:  String,
    email: String
  },
  photos: [{
    source: { type: String },
    url: { type: String }
  }]
},
  { timestamps: true }
)


module.exports = mongoose.model('User', UserSchema)