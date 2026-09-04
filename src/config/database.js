import mongoose from "mongoose";
import { config } from "./config.js";
import { DB_NAME } from "../constants.js";

export async function connectDB() {
    const connectionInstance = await mongoose.connect(`${config.MONGODB_URI}/${DB_NAME}`)
    console.log(`DB connected successfully! host: ${connectionInstance.connection.host}`)
}