import mongoose from "mongoose";

const url:string = process.env.MONGO_URL || "mongodb://localhost:27017/test";
mongoose.connect(url);