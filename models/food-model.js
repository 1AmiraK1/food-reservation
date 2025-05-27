const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, default: 0 },
  image: { type: String, default: '/image/profile.jpg' },
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' }
});
const Food = mongoose.model('Food', foodSchema);

module.exports = Food;