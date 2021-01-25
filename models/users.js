const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcryptjs')
const findOrCreate = require('mongoose-findorcreate')

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

UserSchema.pre('save', function (next) {
  var user = this;
  if (!user.isModified('password')) { return next() };
  bcrypt.hash(user.password, 10).then((hashedPassword) => {
    user.password = hashedPassword;
    next();
  })
}, function (err) {
  next(err)
})
UserSchema.methods.comparePassword = function (candidatePassword, next) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) return next(err);
    next(null, isMatch)
  })
}

//static method to find user by FB, Google, or Twitter ID if they are already a member, if not, create new member
UserSchema.plugin(findOrCreate)

module.exports = mongoose.model('User', UserSchema)