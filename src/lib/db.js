import mongoose from "mongoose";

export const connectToDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: process.env.DATABASE_NAME,
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}
