import subReddit from '../models/subRedditModel.js'
import {Router} from 'express'
import * as subRedditController from '../controller/subRedditController.js'
import express from 'express'
import auth from '../util/auth.js'

const router = Router();

router.post('/',auth,subRedditController.createSub)
router.get('/',auth,subRedditController.getSub);
router.get('/:id',auth,subRedditController.getRequestedSub)


export default router;