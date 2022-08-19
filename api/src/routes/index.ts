import authRouter from './login'
import friendRouter from './friend'
import messageRoute from './messages'
import devRouter from './dev'
import {Router} from 'express'
import authMiddleware from '../utils/middleware/auth'

const router = Router();


router.use(authMiddleware)
router.use("/dev", devRouter)
router.use("/auth", authRouter)
router.use("/friend", friendRouter)
router.use("/message", messageRoute)

router.get('/', (req, res) => res.send('Hello World!'));

export default router;


