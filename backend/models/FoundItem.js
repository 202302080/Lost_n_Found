const mongoose = require('mongoose')

const FoundItemSchema = new mongoose.Schema({
  item: {
    type: String,
    required: true,
  },
  contact: {
    type: String,
    required: true,
  },
  messenger: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    default: null,
  },
  user: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  avatar: {
    type: String,
    default: 'https://randomuser.me/api/portraits/men/1.jpg',
  },
}, { timestamps: true })

module.exports = mongoose.model('FoundItem', FoundItemSchema)
