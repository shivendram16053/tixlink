import mongoose from 'mongoose';

const MONGO_URL = process.env.MONGO_URL as string;

if (!MONGO_URL) {
    throw new Error('Please define the MONGO_URL environment variable inside .env.local');
}

export const connectToDatabase = async () => {
    try {
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(MONGO_URL);
            console.log('Connected to MongoDB');
        }
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        throw new Error('Failed to connect to MongoDB');
    }
};
