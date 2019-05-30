const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const carSchema = new Schema({
  model: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true
  }
});

module.exports = mongoose.model('Car', carSchema);
