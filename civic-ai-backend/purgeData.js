const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/civic_ai';

async function purge() {
  try {
    console.log('Connecting to database for data purge...');
    await mongoose.connect(MONGODB_URI);
    
    // List of collections to clear
    const collections = ['complaints', 'citizens', 'notifications', 'tickets'];
    
    for (const colName of collections) {
      try {
        const result = await mongoose.connection.collection(colName).deleteMany({});
        console.log(`✓ Cleared ${colName}: ${result.deletedCount} documents removed.`);
      } catch (colErr) {
        console.warn(`! Could not clear ${colName} (it may not exist yet).`);
      }
    }

    // Clear uploaded files
    const uploadsDir = path.join(__dirname, 'uploads');
    if (fs.existsSync(uploadsDir)) {
      console.log('Cleaning uploads folder...');
      const files = fs.readdirSync(uploadsDir);
      
      let fileCount = 0;
      for (const file of files) {
        // Skip hidden files or specific system files if any
        if (!file.startsWith('.')) {
          fs.unlinkSync(path.join(uploadsDir, file));
          fileCount++;
        }
      }
      console.log(`✓ Deleted ${fileCount} uploaded images.`);
    }

    console.log('\nSUCCESS: All user-submitted data has been purged.');
    process.exit(0);
  } catch (err) {
    console.error('\nERROR during purge:', err.message);
    process.exit(1);
  }
}

purge();
