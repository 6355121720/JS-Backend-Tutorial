import mongoose from 'mongoose'

const hospitalSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:true
        },
        address:{
            type:String,
            required:true,
        },
        specializedAt:{
            type:[String]
        }
    }
)

export const Hospital = mongoose.model("Hospital", hospitalSchema)