const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = 'mongodb+srv://ssha0539_db_user:UsFs6WtBlHA2M9WF@cluster0.spuqyxz.mongodb.net/live_tv?retryWrites=true&w=majority&appName=Cluster0';

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'admin' },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to DB');
    
    const existingAdmin = await User.findOne({ email: 'admin@live.tv' });
    if (existingAdmin) {
      console.log('Admin already exists');
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash('admin123', 10);
    await User.create({
      name: 'Admin User',
      email: 'admin@live.tv',
      password: hashedPassword,
      role: 'admin',
    });
    
    console.log('Admin created: admin@live.tv / admin123');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
