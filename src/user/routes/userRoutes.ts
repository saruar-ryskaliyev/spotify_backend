import { Router } from 'express';
import { addFavoriteSong, removeFavoriteSong, getFavoriteSongs } from '../controllers/userController';
import { authMiddleware } from '../../auth/middlewares/auth-middleware';


const router = Router();

router.use(authMiddleware); // Apply authentication middleware to all routes

router.get('/favorites', getFavoriteSongs);
router.post('/favorites', addFavoriteSong);
router.delete('/favorites', removeFavoriteSong);

export default router;