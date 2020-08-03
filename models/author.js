const mongoose = require('mongoose')
const Book = require('./book')

const authorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }
})

//check to see if the author still has any books
//if they do then the author cannot be deleted
authorSchema.pre('remove', function(next) {
  Book.find({ author: this.id }, (err, books) => {
    if (err) {
      next(err)
    } else if (books.length > 0) {
      next(new Error('Cannot delete : This author still has books'))
    } else {
      next()
    }
  })
})

module.exports = mongoose.model('Author', authorSchema)
