import {Router} from 'express';
import authRouter from './auth/auth-router';
import songRoutes from './song/routes/songRoutes';
import artistRoutes from './artist/routes/artistRoutes';
import albumRoutes from './album/routes/albumRoutes';
import userRoutes from './user/routes/userRoutes';
import playlistRoutes from './playlist/routes/playlistRoutes';


const router = Router();

router.use('/auth',authRouter);
router.use('/songs', songRoutes);
router.use('/artists', artistRoutes);
router.use('/albums', albumRoutes);
router.use('/users', userRoutes);
router.use('/playlists', playlistRoutes);


export default router;