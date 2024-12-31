import mongoose from "mongoose"

const productSchema = new mongoose.Schema(
    {
        description:{
            type:String,
        },
        name:{
            type:String,
            required:true
        },
        image:{
            type:String,
            default:"Not Given"
        },
        category:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Category",
            required:true
        },
        stock:{
            type:Number,
            default:0
        },
        owner:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
        }
    },
    {
        timestamps:true
    }
)


export const Product = mongoose.model("Product", productSchema)