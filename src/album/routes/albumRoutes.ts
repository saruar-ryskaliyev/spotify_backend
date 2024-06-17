import { Router } from 'express';
import multer from 'multer';
import { createAlbum, getAlbum, updateAlbum, deleteAlbum, searchAlbums, getAllAlbums } from '../controllers/albumController';
import { authMiddleware } from '../../auth/middlewares/auth-middleware';

const upload = multer();

const router = Router();

router.get('/search', searchAlbums);
router.get('/', getAllAlbums);
router.post('/', upload.fields([{ name: 'albumCover', maxCount: 1 }]), createAlbum);
router.get('/:id', getAlbum);
router.put('/:id', updateAlbum);
router.delete('/:id', deleteAlbum);

export default router;
