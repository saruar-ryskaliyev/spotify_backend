import { Router } from 'express';
import multer from 'multer';
import { createArtist, updateArtist, getArtists, searchArtists } from '../controllers/artistController';

const upload = multer();

const router = Router();

router.post('/', upload.fields([{ name: 'photo', maxCount: 1 }]), createArtist);
router.put('/:id', upload.fields([{ name: 'photo', maxCount: 1 }]), updateArtist);
router.get('/', getArtists);
router.get('/search', searchArtists);

export default router;
