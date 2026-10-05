import mongoose from "mongoose";

export async function connectDB(uri = process.env.MONGODB_URI) {
  const mongoUri = uri || "mongodb://127.0.0.1:27017/aika_ai";
  try {
    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
    throw error;
  }
}

export default connectDB;
