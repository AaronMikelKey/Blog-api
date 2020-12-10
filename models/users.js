const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcryptjs')

const UserSchema = new Schema({
  facebookId: { type: String, unique: true },
  username: { type: String, unique: true },
  password: { type: String },
  email: { type: String, unique: true }
},
  { timestamps: true }
)

UserSchema.pre('save', function (next) {
  var user = this;
  if (!user.isModified('password')) {return next()};
  bcrypt.hash(user.password,10).then((hashedPassword) => {
      user.password = hashedPassword;
      next();
  })
}, function (err) {
  next(err)
})
UserSchema.methods.comparePassword=function(candidatePassword,next){    
    bcrypt.compare(candidatePassword,this.password,function(err,isMatch){
      if(err) return next(err);
      next(null,isMatch)
  })
}

module.exports = mongoose.model('User', UserSchema)