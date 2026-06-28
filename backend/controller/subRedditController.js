import mongoose from "mongoose";
import subRedditModel from "../models/subRedditModel.js";

export async function createSub(req,res) {
    try {
        const {name,description} = req.body

        const isAlreadyExists = await subRedditModel.findOne({name:name})
        if(isAlreadyExists) return res.status(409).json({message: "subReddit alr exists"})
        const subReddit = await subRedditModel.create({
            name,
            creator: req.user.id,
            followers: 0,
            description
        })

        res.status(201).json({subReddit})
    } catch (error) {
        console.error(error)
        res.status(500).json({message: "Error occur from server side"});
    }
}

export async function getSub(req,res){
    try {
        const loggedId = req.user.id

        const subReddits = await subRedditModel.find({creator : loggedId})
        console.log(subReddits);
        res.status(200).json(subReddits)
    } catch (error) {
        console.error(error)
        res.status(500).json({message: "Error occur from server side"});
    }
}
export async function getRequestedSub(req,res){
    try {
        const subName = req.params.id;
        const loggedId = req.user.id;

        const sub = await subRedditModel.findOne({
            creator: loggedId,
            name: subName
        })

        console.log(sub)
        res.status(200).json(sub)
    } catch (error) {
        console.error(error)
        res.status(500).json({message: "Error occur from server side"});
    }
}