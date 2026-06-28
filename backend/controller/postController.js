import mongoose from "mongoose";
import postModel from "../models/postModel.js"

export async function createPost(req,res) {
    try {
        const {title,description,subRedditId} = req.body
        const post = await postModel.create({
            title,
            author : req.user.id,
            description,
            upVotes: 0,
            downVotes: 0,
            subReddit: subRedditId
        })

        res.status(201).json(post)
    } catch (error) {
        console.error(error)
        res.status(500).json({message: "Error occur from server side"});
    }
}

