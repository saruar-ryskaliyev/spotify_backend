import { Router } from 'express';
import multer from 'multer';
import { createAlbum, getAlbum, updateAlbum, deleteAlbum, searchAlbums } from '../controllers/albumController';

const upload = multer();

const router = Router();

router.post('/', upload.fields([{ name: 'albumCover', maxCount: 1 }]), createAlbum);
router.get('/:id', getAlbum);
router.put('/:id', updateAlbum);
router.delete('/:id', deleteAlbum);
router.get('/search', searchAlbums);

export default router;
