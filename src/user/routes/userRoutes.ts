import { Router } from 'express';
import { addFavoriteSong, removeFavoriteSong, createPlaylist, addSongToPlaylist, removeSongFromPlaylist } from '../controllers/userController';

const router = Router();

// Favorites
router.post('/:userId/favorites', addFavoriteSong);
router.delete('/:userId/favorites', removeFavoriteSong);

// Playlists
router.post('/:userId/playlists', createPlaylist);
router.post('/:userId/playlists/:playlistId/songs', addSongToPlaylist);
router.delete('/:userId/playlists/:playlistId/songs', removeSongFromPlaylist);

export default router;
