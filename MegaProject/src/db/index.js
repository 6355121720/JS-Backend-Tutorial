import mongoose from 'mongoose'
import {DB_NAME} from '../constants.js'


const connectDB = async function(){
    try{
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log("MONGO DB connected Successfully!")
    }
    catch(error){
        console.log(error);
        process.exit(1)
    }
}

export default connectDB