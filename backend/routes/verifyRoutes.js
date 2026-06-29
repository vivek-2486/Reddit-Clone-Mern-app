import { Router } from "express";
import auth from "../util/auth.js";
import express from 'express'

const router = Router()

router.get('/',auth,(req,res) => {
    res.status(200).json({message: "success"})
})

export default router