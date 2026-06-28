import userModals from '../models/userModel.js'
import {Router} from 'express'
import * as userController from '../controller/userController.js'
import express from 'express'


const router = Router();

router.post('/',userController.addUser)
router.post('/login',userController.login);

export default router;