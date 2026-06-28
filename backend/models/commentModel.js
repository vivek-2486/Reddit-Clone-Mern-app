import mongoose from 'mongoose'

const commentSchema =new mongoose.Schema({
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
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "post",
        required: true
    }
},{
    timestamps: true
})

const post = mongoose.model("post",commentSchema);
export default post;