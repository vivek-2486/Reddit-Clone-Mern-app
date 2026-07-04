import mongoose from 'mongoose'

const commentSchema =new mongoose.Schema({
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    description:{
        type: String,
        required: true
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "post",
        required: true
    },
    parentComment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "comment",
        default: null
    }
},{
    timestamps: true
})

const commentModel = mongoose.model("comment",commentSchema);
export default commentModel;