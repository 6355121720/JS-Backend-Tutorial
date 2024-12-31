import mongoose from "mongoose"

const categorySchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:true,
            unique:true
        },
        color:{
            type:String,
            enum: ['Red','Cyan','Magenta'],
            default:"Red"
        }
    }
)

export const Category = mongoose.model("Category", categorySchema)