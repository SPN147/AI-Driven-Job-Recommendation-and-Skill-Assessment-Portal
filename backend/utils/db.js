import mongoose from "mongoose";

// We use utils folder to store cloud and multinary.

const connectDB = async() =>{
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("mongodb connected successfully.")
    } catch (error) {
        console.log(error);
    }
}

export default connectDB;