import mongoose from 'mongoose'

const doctorSchema = new mongoose.Schema(
    {
        "name":{
            type:String,
            required:true
        },
        "age":{
            type:Number
        },
        "specializedIn":{
            type:[String],
            required:true
        },
        "qualification":{
            type:String,
            required:true
        },
        "worksAt":{
            type:[{
                type:mongoose.Schema.Types.ObjectId,
                ref:"Hospital"
            }]
        },
        "salary":{
            type:Number,
            required:true
        },
        "experienceInYears":{
            type:Number,
            default:0
        }
    }
)

export const Doctor = mongoose.model("Doctor", doctorSchema)