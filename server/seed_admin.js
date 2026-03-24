const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const exists = await User.findOne({ email: 'admin@test.com' });
        if (exists) {
            console.log('User already exists');
        } else {
            await User.create({
                name: 'Test Administrator',
                email: 'admin@test.com',
                password: 'password123',
                role: 'admin',
                phone: '1234567890',
                location: { address: 'Admin HQ', city: 'Chennai', state: 'Tamil Nadu', zip: '600001' }
            });
            console.log('User created: admin@test.com / password123');
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seed();
