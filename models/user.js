const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

//hash the passowrd before saving passowrd to the db
userSchema.pre('save', function(next) {
    if(this.password) {
        var salt = bcrypt.genSaltSync(10)
        this.password  = bcrypt.hashSync(this.password, salt)
    }
    next()
})

const user = mongoose.model('User', userSchema);

module.exports = user;
