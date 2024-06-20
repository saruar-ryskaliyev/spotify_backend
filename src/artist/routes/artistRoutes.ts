import { Router } from 'express';
import multer from 'multer';
import { createArtist, updateArtist, getArtists, searchArtists, getArtistById } from '../controllers/artistController';
import { authMiddleware } from '../../auth/middlewares/auth-middleware';

const upload = multer();

const router = Router();

router.use(authMiddleware);

router.get('/search', searchArtists);
router.post('/', upload.fields([{ name: 'photo', maxCount: 1 }]), createArtist);
router.put('/:id', upload.fields([{ name: 'photo', maxCount: 1 }]), updateArtist);
router.get('/', getArtists);
router.get('/:id', getArtistById);

export default router;
