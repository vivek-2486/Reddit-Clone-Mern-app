import mongoose from 'mongoose'

const userSchema =new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    joinedSub: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'subreddit'
    }]
},{
    timestamps: true
})

const userModel = mongoose.model("user",userSchema);
export default userModel;