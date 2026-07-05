import userModals from '../models/userModel.js'
import {Router} from 'express'
import * as userController from '../controller/userController.js'
import express from 'express'
import upload from '../util/upload.js'
import auth from '../util/auth.js'

const router = Router();

router.post('/',userController.addUser)
router.post('/login',userController.login);
router.put('/profile-picture',upload.single('profilePicture'),auth,userController.addProfilePicture)

export default router;