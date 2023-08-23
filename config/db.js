import mongoose from 'mongoose';
import dotenv from 'dotenv';

export const mongoConnect = async () => {
  try {
    console.log("MONGO_CONNECT_URL =>", process.env.MONGO_CONNECT_URL)
    await mongoose.connect(process.env.MONGO_CONNECT_URL, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    console.log('Connected to Mongo database');
  } catch (e) {
    console.log(`Error connecting to mongo database ${e}`);
  }
};
