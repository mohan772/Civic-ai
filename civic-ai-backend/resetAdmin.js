const mongoose = require('mongoose');
const Admin = require('./models/Admin');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/civic_ai';

async function resetAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Delete existing admin to be sure
    await Admin.deleteOne({ email: 'admin@city.gov' });

    const newAdmin = new Admin({
      email: 'admin@city.gov',
      password: 'AdminPassword123'
    });

    await newAdmin.save();
    console.log('Successfully reset Admin credentials!');
    console.log('Email: admin@city.gov');
    console.log('Password: AdminPassword123');

    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

resetAdmin();
