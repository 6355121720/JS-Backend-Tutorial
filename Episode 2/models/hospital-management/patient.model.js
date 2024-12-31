import mongoose from 'mongoose'

const patientSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:true
        },
        diagnosedWith:{
            type:String,
            required:true
        },
        age:{
            type:Number,
            required:true
        },
        admittedAt:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Hospital",
            required:true
        },
        bloodgroup:{
            type:String,
            enum:["A","A+","A-","B","O","O+"],
            required:true
        },
        sex:{
            type:String,
            enum:['M','F','O'],
            required:true
        }
    }
)

export const Patient = mongoose.model("Patient", patientSchema)