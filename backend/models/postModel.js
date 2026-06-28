import mongoose from 'mongoose'

const postSchema =new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true,
        unique: true,
    },
    description:{
        type: String,
        required: true
    },
    upVotes: {
        type: String,
        default: 0
    },
    downVotes: {
        type: String,
        default: 0
    },
    subReddit: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "subReddit",
        required: true
    }
},{
    timestamps: true
})

const postModel = mongoose.model("post",postSchema);
export default postModel;