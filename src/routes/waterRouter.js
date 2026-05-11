import {Router} from 'express'
import { protectRouter } from '../middleware/protectRoute.js'
import { addWater, getWater } from '../controllers/waterController.js'
const waterRouter=Router()
waterRouter.post('/add',protectRouter,addWater)
waterRouter.get('/today',protectRouter,getWater)
export default waterRouter