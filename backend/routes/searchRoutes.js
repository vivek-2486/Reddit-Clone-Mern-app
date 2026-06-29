import {Router} from 'express'
import express from 'express'
import auth from '../util/auth.js'
import subRedditModel from '../models/subRedditModel.js';
import postModel from '../models/postModel.js';
import mongoose from 'mongoose';

const router = Router();

const getSearchResults = async(req,res) =>{

    try {
        const loggedId = req.user.id
        const {q} = req.query
        if(!q) return res.json({communities: [],post: []})
        const [communities, post] = await Promise.all([

            subRedditModel.find({name: {$regex: q, $options: 'i'}})
                .select('name _id description createdAt')
                .limit(5),
            
            postModel.find({
                $or:[
                    {title: {$regex:q, $options:'i'}},
                    {description: {$regex:q, $options:'i'}}
                ]
            })
            .select('title _id subReddit createdAt')
            .populate('subReddit')
            .limit(5)

        ])

        res.json({communities,post})

    } catch (error) {
        console.error(error)
        res.status(500).json({message: "search failed"})
    }

}

router.get('/',auth,getSearchResults)

export default router;