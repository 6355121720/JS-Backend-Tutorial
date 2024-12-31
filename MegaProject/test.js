import { cloudinary } from "./src/utils/cloudinary.js";
import dotenv from 'dotenv'

dotenv.config({
    path:"./.env"
})

console.log(await cloudinary.uploader.upload("cat.jpeg"))