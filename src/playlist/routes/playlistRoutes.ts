import { Router } from 'express';
import { createPlaylist, getUserPlaylists, addSongToPlaylist, removeSongFromPlaylist, deletePlaylist, getPlaylistById } from '../controllers/playlistController';
import { authMiddleware } from '../../auth/middlewares/auth-middleware';

const router = Router();

router.use(authMiddleware); // Apply authentication middleware to all routes

// Playlists
router.post('/', createPlaylist);
router.get('/', getUserPlaylists);
router.post('/:playlistId/songs', addSongToPlaylist);
router.delete('/:playlistId/songs', removeSongFromPlaylist);
router.delete('/:playlistId', deletePlaylist);
router.get('/:playlistId', getPlaylistById);
export default router;
