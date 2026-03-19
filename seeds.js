require('dotenv').config();
const mongoose = require('mongoose');
const Novel = require('./models/novel');
const novels = require('./novels.json');

const seedDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB connected!');

  await Novel.deleteMany({});
  console.log('Cleared existing novels');

  await Novel.insertMany(novels);
  console.log(`${novels.length} novels seeded successfully!`);

  await mongoose.connection.close();
  console.log('Done! Connection closed.');
};

seedDB();