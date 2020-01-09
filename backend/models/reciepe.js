const mongoose = require('mongoose');

const reciepeSchema = mongoose.Schema({
  title: {type: String, required: true},
  content: {type: String, required: true},
  type: {type: String, required: true},
  created_on: {type: Date, default: Date.now},
  isActive: {type: Boolean, default: true},
  imagePath: {type: String, required: true},
  createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}
});

module.exports = mongoose.model('Reciepe', reciepeSchema);
