// Quick script to fix the database slug index issue
require('dotenv').config();
const mongoose = require('mongoose');

async function fixDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/kaisiri');
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    
    // Drop the products collection to start fresh
    try {
      await db.collection('products').drop();
      console.log('✅ Dropped products collection');
    } catch (err) {
      console.log('ℹ️  Products collection does not exist (this is fine)');
    }

    // Drop the sessions collection if it exists
    try {
      await db.collection('sessions').drop();
      console.log('✅ Dropped sessions collection');
    } catch (err) {
      console.log('ℹ️  Sessions collection does not exist (this is fine)');
    }

    console.log('✅ Database cleaned! Now run: npm run seed');
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

fixDatabase();
