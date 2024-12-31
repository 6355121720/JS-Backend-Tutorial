import {v2 as cloudinary} from 'cloudinary'
import fs from 'fs'
import dotenv from 'dotenv'

dotenv.config({
    path:'./.env'
})

cloudinary.config({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
    api_key : process.env.CLOUDINARY_API_KEY,
    api_secret : process.env.CLOUDINARY_API_SECRET
})


const uploadOnCloudinary = async (localFilePath) => {
    try{
        if (!localFilePath) return
        const response = await cloudinary.uploader.upload(localFilePath)
        //file has been uploaded successfully
        // fs.unlinkSync(localFilePath)
        console.log("file is uploaded on cloudinary", response.url)
        return response
    }
    catch(err){
        // fs.unlinkSync(localFilePath)
        console.log(err)
        return null
    }
}

export {uploadOnCloudinary, cloudinary}