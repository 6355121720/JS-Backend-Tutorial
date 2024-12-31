import mongoose from 'mongoose'


const subTodoSchema = new mongoose.Schema(
    {
        'content':{
            type:String,
            required:true
        },
        'isDone':{
            type:Boolean,
            default:true
        }
    },
    {
        timestamps:true
    }
)


export const SubTodo = mongoose.model("SubTodo", subTodoSchema)