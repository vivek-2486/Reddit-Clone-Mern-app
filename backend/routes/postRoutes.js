import postModel from '../models/postModel.js'
import {Router} from 'express'
import * as postController from '../controller/postController.js'
import express from 'express'
import auth from '../util/auth.js'

const router = Router();


router.post('/',auth,postController.createPost)
router.get('/feed',auth,postController.getFeed)
router.get('/singlePost/:id',auth,postController.getPost)
router.get('/:id',auth,postController.getPosts)
router.put('/:id/upVote',auth,postController.handleUpVote)
router.put('/:id/downVote',auth,postController.handleDownVote)
router.delete('/:id/delete',auth,postController.deletePost)

export default router;