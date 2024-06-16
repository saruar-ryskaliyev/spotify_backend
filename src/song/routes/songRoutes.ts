import { Router } from 'express';
import multer from 'multer';
import { createSong } from '../controllers/songController';

const upload = multer();

const router = Router();

router.post('/', upload.single('file'), createSong);

// Add other CRUD routes here (GET, PUT, DELETE)

export default router;
