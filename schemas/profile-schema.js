const mongoose = require('mongoose')

const reqString = {
  type: String,
  required: true,
}

const profileSchema = mongoose.Schema({
  userID: reqString,
  KR: {
    type: Number,
    required: true,
  },
  KRbank: {
    type: Number,
    required: true,
  }
})

module.exports = mongoose.model('kr-profiles', profileSchema)
