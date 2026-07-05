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
    followers:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user' 
    }],
    description:{
        type: String,
        required: true
    },
    image: {
        url: {
            type: String,
            default: ""
        },
        public_id: {
            type: String,
            default: ""
        }
    }

},{
    timestamps: true
})

const subRedditModel = mongoose.model("subreddit",subRedditSchema);
export default subRedditModel;