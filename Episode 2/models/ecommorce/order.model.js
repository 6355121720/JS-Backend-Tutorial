import mongoose from "mongoose"


const itemSchema = new mongoose.Schema(
    {
        product:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Product",
            required:true
        },
        quantity:{
            type:Number,
            required:true
        }
    }
)

const Item =  mongoose.model("Item", itemSchema)

const orderSchema = mongoose.Schema(
    {
        price:{
            type:Number,
            required:true
        },
        customer:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
        },
        items:{
            type:[Item]
        },
        // items:[Item]
        // items:[{
        //     type:Item
        // }]
        address:{
            type:String,
            required:true
        },
        status:{
            type:String,
            enum:['Pending','Cancelled','Delivered'],
            default:'Pending'
        }

    },
    {
        timestamps:true
    }
)