import express from "express";
import jwt from 'jsonwebtoken'
import config from "./config.js";

async function auth(req,res,next) {
        const authHeader = req.headers['authorization']
        console.log(authHeader)
        const token = authHeader && authHeader.split(' ')[1]
        if(!token) return res.status(401).json({message: "access denied : no token provided"});
        
        jwt.verify(token,config.jsonwebtoken,(err,user) => {
            if(err)
                return res.status(401).json({message: "access denied: invalid token"});
            req.user = user;
            next()
        })
}

export default auth