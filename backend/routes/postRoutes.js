import postModel from '../models/postModel.js'
import {Router} from 'express'
import * as postController from '../controller/postController.js'
import express from 'express'
import auth from '../util/auth.js'

const router = Router();

router.post('/',auth,postController.createPost)
// router.post('/login',postController.login);

export default router;