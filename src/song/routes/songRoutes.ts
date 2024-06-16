import { Router } from 'express';
import multer from 'multer';
import { createSong, getSong, updateSong, deleteSong } from '../controllers/songController';

const upload = multer();

const router = Router();

router.post('/', upload.fields([{ name: 'songFile', maxCount: 1 }, { name: 'coverImage', maxCount: 1 }]), createSong);
router.get('/:uuid', getSong);
router.put('/:uuid', updateSong);
router.delete('/:uuid', deleteSong);

export default router;
