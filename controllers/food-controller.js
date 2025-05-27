const Food = require('../models/food-model');


const getFoodsByRestaurant = async (req, res) => {
  try {
    const restaurantId = req.params.restaurantId;
    const foods = await Food.find({ restaurant: restaurantId }).lean();
    res.status(200).json(foods);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'خطایی در دریافت غذاها رخ داد.' });
  }
};


module.exports = {getFoodsByRestaurant}