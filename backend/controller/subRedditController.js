import mongoose from "mongoose";
import subRedditModel from "../models/subRedditModel.js";
import userModel from '../models/userModel.js'
import cloudinary from "../config/cloudinary.js";
import postModel from "../models/postModel.js";

export async function createSub(req, res) {
    try {
        const { name, description } = req.body

        const isAlreadyExists = await subRedditModel.findOne({ name: name })
        if (isAlreadyExists) return res.status(409).json({ message: "subReddit alr exists" })

        const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    folder: "subreddit-picture"
                },
                (error, result) => {
                    if (error) return reject(error)
                    resolve(result)
                }

            );
            stream.end(req.file.buffer);

        })
        const subReddit = await subRedditModel.create({
            name,
            creator: req.user.id,
            followers: [],
            description,
            image: {
                url: result.secure_url,
                public_id: result.public_id
            }
        })

        res.status(201).json({ subReddit })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Error occur from server side" });
    }
}

export async function getSub(req, res) {
    try {
        const loggedId = req.user.id

        const subReddits = await subRedditModel.find({ creator: loggedId })
        res.status(200).json(subReddits)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Error occur from server side" });
    }
}
export async function getRequestedSub(req, res) {
    try {
        const subName = req.params.id;
        const loggedId = req.user.id;

        const sub = await subRedditModel.findOne({
            name: subName
        })
        if (!sub) {
            return res.status(404).json({
                message: "Community not found",
            });
        }

        res.status(200).json(sub)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Error occur from server side" });
    }
}

export async function handleJoin(req, res) {
    try {
        const loggedId = req.user.id
        const subId = req.params.id


        const sub = await subRedditModel.findOneAndUpdate(
            { _id: subId, followers: loggedId },
            { $pull: { followers: loggedId } },
            { new: true }
        )
        if (sub) {
            const userUpdated = await userModel.findOneAndUpdate(
                { _id: loggedId },
                { $pull: { joinedSub: subId } },
                { new: true }
            )
            return res.status(200).json({ message: "Unfollowed successfully", sub });
        }
        else {
            const sub = await subRedditModel.findByIdAndUpdate(
                subId,
                { $addToSet: { followers: loggedId } },
                { new: true }
            )
            if (!sub) {
                return res.status(404).json({ message: "Subreddit not found" });
            }
            const userUpdate = await userModel.findByIdAndUpdate(
                loggedId,
                { $addToSet: { joinedSub: subId } },
                { new: true }
            )

            return res.status(200).json({ message: "Followed successfully", sub })
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Error in handleJoin" })
    }
}

export async function getFollowers(req, res) {
    try {
        const loggedId = req.user.id
        const subs = await userModel.findById(loggedId).populate({
            path: 'joinedSub'
        })

        res.status(200).json({ followingSubs: subs.joinedSub })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "server error for getting following subs" })
    }
}

export async function deleteSub(req, res) {

    try {
        const subName = req.params.id
        const loggedId = req.user.id

        const sub = await subRedditModel.findOneAndDelete({
            name: subName
        });
        if (!sub) {
            return res.status(404).json({ message: "Community not found" });
        }
        await userModel.updateMany(
            {},
            {
                $pull: {
                    joinedSub: sub._id
                }
            }
        )
        const posts = await postModel.find({ subreddit: sub._id });

        for (const post of posts) {
            if (post.image?.public_id) {
                await cloudinary.uploader.destroy(post.image.public_id);
            }
        }
        await postModel.deleteMany({ subreddit: sub._id })
        res.status(200).json({ message: "deletes successfully" })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "error in deleting" })
    }
}