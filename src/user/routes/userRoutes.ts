import { Router } from 'express';
import { addFavoriteSong, removeFavoriteSong, getFavoriteSongs, globalSearch } from '../controllers/userController';
import { authMiddleware } from '../../auth/middlewares/auth-middleware';


const router = Router();

router.use(authMiddleware); 

router.get('/favorites', getFavoriteSongs);
router.get('/search', globalSearch)
router.post('/favorites', addFavoriteSong);
router.delete('/favorites', removeFavoriteSong);


export default router;
