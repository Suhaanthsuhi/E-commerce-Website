import mongoose from 'mongoose';

const connectDB = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGODB_CONNECT);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    }catch(error){
        console.log(`MongoDB giving error: ${error}`);
    }
}

export default connectDB;