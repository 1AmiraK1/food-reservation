const fs = require('fs');
const path = require('path');
const connectDB = require('./config/db');
const mongoose = require('mongoose');
const Restaurant = require('./models/restaurant-model');
const Food = require('./models/food-model');

async function seedData() {
  try {
    await connectDB();

    const restaurantCount = await Restaurant.countDocuments();
    const foodCount = await Food.countDocuments();

    if (restaurantCount === 0 && foodCount === 0) {
      const createdRestaurants = await Restaurant.insertMany([
        { name: 'رستوران مرکزی' },
        { name: 'رستوران گلها' },
        { name: 'رستوران سبحان' },
      ]);

      await Food.insertMany([
        // رستوران مرکزی
        { name: 'چلوکباب سلطانی', price: 220000, restaurant: createdRestaurants[0]._id },
        { name: 'زرشک پلو با مرغ', price: 140000, restaurant: createdRestaurants[0]._id },
        { name: 'قیمه نثار', price: 160000, restaurant: createdRestaurants[0]._id },

        // رستوران گلها
        { name: 'قرمه‌سبزی', price: 130000, restaurant: createdRestaurants[1]._id },
        { name: 'عدس‌پلو', price: 100000, restaurant: createdRestaurants[1]._id },
        { name: 'کشک بادمجان', price: 110000, restaurant: createdRestaurants[1]._id },

        // رستوران سبحان
        { name: 'جوجه‌کباب', price: 150000, restaurant: createdRestaurants[2]._id },
        { name: 'کتلت خانگی', price: 120000, restaurant: createdRestaurants[2]._id },
        { name: 'لوبیاپلو', price: 110000, restaurant: createdRestaurants[2]._id }
      ]);

      console.log('📦 دیتای اولیه وارد شد.');

      const filePath = path.join(__dirname, 'seed.js');
      fs.unlinkSync(filePath);
      console.log('🗑️ فایل seed.js حذف شد.');
    } else {
      console.log('✅ دیتابیس از قبل داده دارد.');
    }

    mongoose.disconnect();
  } catch (err) {
    console.error('❌ خطا در seeding:', err);
    process.exit(1);
  }
}

seedData();
