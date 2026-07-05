import mongoose from "mongoose";
import postModel from "../models/postModel.js"
import subRedditModel from "../models/subRedditModel.js";
import userModel from "../models/userModel.js";
import commentModel from "../models/commentModel.js";
import cloudinary from "../config/cloudinary.js";

export async function createPost(req,res) {
    try {
        const {title,content,subredditId} = req.body
        const loggedId = req.user.id
        let result = null;
        if(req.file){

            result = await new Promise((resolve,reject) => {
                                const stream = cloudinary.uploader.upload_stream(
                                    {
                                        folder: "subreddit-picture"
                                    },
                                    (error,result) => {
                                        if(error) return reject(error)
                                        resolve(result)
                                    }
            
                                );
                                stream.end(req.file.buffer);
            
                            })
        }
        console.log(result)
        const post = await postModel.create({
            title,
            creator : loggedId,
            content,
            image: {
                url: result?.secure_url || "",
                public_id: result?.public_id || ""
            },
            upVotes: [],
            downVotes: [],
            subreddit: subredditId
        })
        console.log(post)
        res.status(201).json(post)
    } catch (error) {
        console.error(error)
        res.status(500).json({message: "Error occur from server side"});
    }
}

export async function getPosts(req,res) {
    try {
        const subredditId = req.params.id
        const loggedId = req.user.id
        const post = await postModel.find({
            subreddit: subredditId
        }).populate("creator","username").sort({createdAt: -1})

        res.status(200).json(post)
    } catch (error) {
        console.error(error)
        res.status(500).json({message: "Error occur from server side"});
    }
}

export async function getPost(req,res) {
    try {
        const postId = req.params.id
        const loggedId = req.user.id
        const post = await postModel.findById(postId).populate("creator","username").populate("subreddit","name")

        res.status(200).json(post)
    } catch (error) {
        console.error(error)
        res.status(500).json({message: "Error occur from server side"});
    }
}

export async function deletePost(req,res) {
    try {
        const loggedId = req.user.id
        const postId = req.params.id

        await postModel.findByIdAndDelete(postId)
        res.status(200).json({message: "deleted successfully"})
    } catch (error) {
        console.error(error)
        res.status(500).json({message: "erron while deleting post from server side"})
    }    
}

export async function handleUpVote(req, res) {
    try {
        const loggedId = req.user.id;
        const postId = req.params.id;

        const post = await postModel.findById(postId);

        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        const hasUpVoted = post.upVotes.includes(loggedId);

        let updatedPost;

        if (hasUpVoted) {
            updatedPost = await postModel.findByIdAndUpdate(
                postId,
                {
                    $pull: {
                        upVotes: loggedId
                    }
                },
                {
                    new: true
                }
            ).populate('creator').populate('subreddit');

            return res.status(200).json({
                message: "Removed upvote",
                post: updatedPost
            });
        }

        updatedPost = await postModel.findByIdAndUpdate(
            postId,
            {
                $pull: {
                    downVotes: loggedId
                },
                $addToSet: {
                    upVotes: loggedId
                }
            },
            {
                new: true
            }
        ).populate('creator').populate('subreddit');

        return res.status(200).json({
            message: "Upvote added",
            post: updatedPost
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error handling upvote"
        });
    }
}

export async function handleDownVote(req, res) {
    try {
        const loggedId = req.user.id;
        const postId = req.params.id;

        const post = await postModel.findById(postId);

        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        const hasDownVoted = post.downVotes.includes(loggedId);

        let updatedPost;

        if (hasDownVoted) {
            updatedPost = await postModel.findByIdAndUpdate(
                postId,
                {
                    $pull: {
                        downVotes: loggedId
                    }
                },
                {
                    new: true
                }
            ).populate('creator').populate('subreddit');

            return res.status(200).json({
                message: "Removed downvote",
                post: updatedPost
            });
        }
        updatedPost = await postModel.findByIdAndUpdate(
            postId,
            {
                $pull: {
                    upVotes: loggedId
                },
                $addToSet: {
                    downVotes: loggedId
                }
            },
            {
                new: true
            }
        ).populate('creator').populate('subreddit');

        return res.status(200).json({
            message: "Downvote added",
            post: updatedPost
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error handling downvote"
        });
    }
}

export async function getFeed(req,res){

    try {
        const {page,limit} = req.query;

        const feed = await postModel.getRankedFeed(Number(page),Number(limit))
        res.status(200).json({feed})
    } catch (error) {
        console.error(error)
        res.status(500).json({message: "Error from Server Side while fetching Feed"});
    }
}
export async function createComment(req, res) {
    try {
        const postId = req.params.id;
        const loggedId = req.user.id;
        const { description, parentId } = req.body;

        let comment = await commentModel.create({
            creator: loggedId,
            description,
            post: postId,
            parentComment: parentId || null
        });

        // Populate creator before sending to frontend
        comment = await comment.populate("creator", "username");

        // Needed by frontend
        comment = comment.toObject();
        comment.replies = [];

        res.status(201).json(comment);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error from Server Side while making a comment"
        });
    }
}

export async function getComments(req, res) {
    try {
        const postId = req.params.id;

        const comments = await commentModel
            .find({ post: postId })
            .populate("creator", "username")
            .sort({ createdAt: -1 })
            .lean();

        const commentMap = {};
        const commentTree = [];

        // Create map
        comments.forEach(comment => {
            comment.replies = [];
            commentMap[comment._id.toString()] = comment;
        });

        // Build tree
        comments.forEach(comment => {
            if (comment.parentComment) {
                const parent = commentMap[comment.parentComment.toString()];

                if (parent) {
                    parent.replies.push(comment);
                }
            } else {
                commentTree.push(comment);
            }
        });

        res.status(200).json(commentTree);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error while sending the comments"
        });
    }
}