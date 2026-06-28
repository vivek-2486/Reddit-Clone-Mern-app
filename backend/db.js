import mongoose from "mongoose";
import config from "./util/config.js";

async function connectDb(){
    try {
        await mongoose.connect(config.MONGODB_URI);
        console.log("moongoose connectes suuccessfully ",config.MONGODB_URI);
    } catch (error) {
        console.error(error)
    }
}

export default connectDb;