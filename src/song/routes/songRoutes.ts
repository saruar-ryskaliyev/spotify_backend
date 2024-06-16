import { Router } from 'express';
import multer from 'multer';
import { createSong, getSong, updateSong, deleteSong, searchSongs } from '../controllers/songController';

const upload = multer();

const router = Router();


router.get('/search', searchSongs);
router.post('/', upload.fields([{ name: 'songFile', maxCount: 1 }, { name: 'coverImage', maxCount: 1 }]), createSong);
router.get('/:id', getSong);
router.put('/:id', updateSong);
router.delete('/:id', deleteSong);

export default router;
