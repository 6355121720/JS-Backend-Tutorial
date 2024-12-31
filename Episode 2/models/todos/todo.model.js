import mongoose from 'mongoose'

const todoSchema = new mongoose.Schema(
    {
        'title':{
            type:String,
            default:'Untitled'
        },
        'color':{
            type:String,
            default:"Black"
        },
        'createdBy':{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default:"Unknown"
        },
        'subTodos':[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"SubTodo"
        }]
    },
    {
        timestamps:true
    }
)


export const Todo = mongoose.model("Todo", todoSchema)