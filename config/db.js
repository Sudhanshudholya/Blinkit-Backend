import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL;

if (!MONGO_URL) {
  throw new Error("Please provide mongodb_url in the .env file");
}

const connectDb = () => {
  mongoose
    .connect(MONGO_URL)
    .then(() => {
      console.log(`Mongodb connection is successfully on port : ${PORT}`);
    })
    .catch((error) => {
      console.log("Mongodb connection is failed", error);
      process.exit(1);
    });
}

export default connectDb
