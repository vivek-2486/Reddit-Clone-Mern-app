import mongoose from 'mongoose'

const subRedditSchema =new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    creator: {
        type: String,
        required: true,
    },
    followers:{
        type: Number,
        default: 0
    },
    description:{
        type: String,
        required: true
    }
},{
    timestamps: true
})

const subRedditModel = mongoose.model("subReddit",subRedditSchema);
export default subRedditModel;