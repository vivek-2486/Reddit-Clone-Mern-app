import mongoose from "mongoose";
import userModal from "../models/userModel.js";
import bcyptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import config from "../util/config.js";
import cloudinary from "../config/cloudinary.js";

export async function addUser(req,res){
    try {
        const {username, email, password} = req.body;
        if(!username){
            return res.status(500).json({message : 'username not provided'})
        }
        if(!email){
            return res.status(500).json({message : 'email not provided'})
        }
        if(!password){
            return res.status(500).json({message : 'password not provided'})
        }
        const isAlrReg = await userModal.findOne({
            $or : [
                {username},
                {email}
            ]
        })

        if(isAlrReg){
            return res.status(409).json({message: 'user alr exist'})
        }

        const hashedPassword = await bcyptjs.hash(password,10);

        // inserting into db
        const user = await userModal.create({
            username,
            email,
            password: hashedPassword,
            joinedSub: []
        })

        console.log(config.jsonwebtoken);

        const token = jwt.sign({
            id: user._id
        }, 
        config.jsonwebtoken,
        {
            expiresIn: "1d"
        }
        )

        res.status(201).json({
            message: "user is added successfully",
            user:{
                name : user.username,
                email : user.email
            },
            token
        })

    } catch (error) {
        res.status(500).json({message : error.message})
    }
}

export async function login(req,res){
    try {
        const {email , password} = req.body;

        const user = await userModal.findOne({email:email})
        if(!user) return res.status(401).json({message: "User not found"})

        const isPasswordCorrect = await bcyptjs.compare(password,user.password)
        if(!isPasswordCorrect){
            return res.status(401).json({message: "Incorrect password"})
        }

        // Step 4: Create (Sign) the JWT
        const token = jwt.sign({
            id: user._id
        },
            config.jsonwebtoken
        ,
            { expiresIn: '1h' } // The token automatically expires in 1 hour
        );

        // Step 5: Send the token back to the frontend client
        return res.status(200).json({
            message: "Login successful!",
            token: token,
            user: { id: user._id, name: user.username, email: user.email ,joinedSub: user.joinedSub} 
        });

    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}

export async function addProfilePicture(req,res) {
    try {
        const loggedId = req.user.id
        const pic = req.file
        const user = await userModal.findById(loggedId)
        if(!user){
            res.status(404).json({message: "user not found"})
        }
        if(user.profilePicture?.public_id){
            await cloudinary.uploader.destroy(user.profilePicture.public_id)
        }

        const result = await new Promise((resolve,reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    folder: "profile-picture"
                },
                (error,result) => {
                    if(error) return reject(error)
                    resolve(result)
                }
                
            );
            stream.end(req.file.buffer);

        })

        user.profilePicture = {
            url: result.secure_url,
            public_id: result.public_id
        }

        await user.save()
        console.log(user)
        res.status(200).json(user);
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Error from server during adding profile picutre"})
    }
}