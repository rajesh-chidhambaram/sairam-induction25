import mongoose from "mongoose";

// Cache the connection to avoid re-creating it in serverless functions
let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

export const connectToDatabase = async () => {
    // If connection is already established, return it
    if (cached.conn) {
        return cached.conn;
    }

    // If no promise exists, create a new connection
    if (!cached.promise) {
        const mongoUri = process.env.MONGODB_URI;
        const dbName = process.env.DATABASE_NAME;

        if (!mongoUri) {
            throw new Error('Please define the MONGODB_URI environment variable');
        }

        if (!dbName) {
            throw new Error('Please define the DATABASE_NAME environment variable');
        }

        const opts = {
            dbName: dbName,
            bufferCommands: false, // Disable mongoose buffering
            maxPoolSize: 10, // Maintain up to 10 socket connections
            serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
            socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
            bufferMaxEntries: 0, // Disable mongoose buffering in dev
        };

        cached.promise = mongoose.connect(mongoUri, opts).then((mongoose) => {
            console.log('Connected to MongoDB successfully');
            return mongoose;
        }).catch((error) => {
            console.error('MongoDB connection error:', error);
            cached.promise = null; // Reset promise on error
            throw error;
        });
    }

    try {
        cached.conn = await cached.promise;
        return cached.conn;
    } catch (error) {
        cached.promise = null; // Reset promise on error
        throw error;
    }
};

// Handle connection events
mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (error) => {
    console.error('Mongoose connection error:', error);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected from MongoDB');
});

// Graceful shutdown
process.on('SIGINT', async () => {
    try {
        await mongoose.connection.close();
        console.log('MongoDB connection closed through app termination');
        process.exit(0);
    } catch (error) {
        console.error('Error during MongoDB disconnection:', error);
        process.exit(1);
    }
});
