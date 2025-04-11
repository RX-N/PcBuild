const mongoose = require('mongoose');

const buildSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  components: Object,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Build', buildSchema);