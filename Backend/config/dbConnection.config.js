import mongoose from "mongoose";

const connectDB = async () => {
    mongoose.connect(process.env.MONGO_URI).then(() => {
        console.log("MongoDB connected successfully");
    }).catch((error) => {
        console.log('MongoDB connection failed:', error.message);   
    })
}

export default connectDB;