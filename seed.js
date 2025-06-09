const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Restaurant = require('./models/restaurant-model');
const Food = require('./models/food-model');

async function seedData() {
  try {
    await connectDB();
    console.log('📡 اتصال به پایگاه داده برقرار شد.');

    const [restaurantCount, foodCount] = await Promise.all([
      Restaurant.countDocuments(),
      Food.countDocuments()
    ]);

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
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log('🗑️ فایل seed.js حذف شد.');
      } else {
        console.warn('⚠️ فایل seed.js پیدا نشد برای حذف.');
      }
    } else {
      console.log('✅ دیتابیس قبلاً داده دارد. عملیات لغو شد.');
    }

    await mongoose.disconnect();
    console.log('🔌 اتصال به دیتابیس قطع شد.');
    process.exit(0);
  } catch (err) {
    console.error('❌ خطا در seeding:', err.message);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seedData();
