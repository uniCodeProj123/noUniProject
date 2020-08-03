const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Book'
  }
});


const user = mongoose.model('order', orderSchema);

module.exports = user;
