const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.local' });
dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    const db = mongoose.connection.db;
    const channels = await db.collection('channels').find({}).toArray();
    console.log(`Total channels: ${channels.length}`);
    const live = channels.filter(c => c.status === 'Live');
    console.log(`Live channels: ${live.length}`);
    
    process.exit(0);
  })
  .catch(console.error);
