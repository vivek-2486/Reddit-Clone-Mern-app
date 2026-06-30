import { Router } from "express";
import auth from "../util/auth.js";
import express from 'express'
import userModel from '../models/userModel.js'
const router = Router()

router.get('/',auth, async(req,res) => {
    try {
        const loggedId = req.user.id;
        const userData = await userModel.findById(loggedId).select("-password")
        res.status(200).json({message: "success", userData})
    } catch (error) {
        res.status(500).json({message: "Error from server during verifying the user"});
    }
})

export default router