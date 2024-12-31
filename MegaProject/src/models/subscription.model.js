import mongoose from "mongoose"

const subscriptionSchema = mongoose.Schema({
    subscriber: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    channel: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    }
},{ timestamp : true})


export const Subscription = mongoose.model("Subscription", subscriptionSchema)