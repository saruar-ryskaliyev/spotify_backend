import { Request, Response } from 'express';
import User from '../../auth/models/User';
import Playlist from '../../playlist/models/playlist.model';

// Add a song to favorites
const addFavoriteSong = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.userId;
        const songId = req.body.songId;

        const user = await User.findById(userId);

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        if (!user.favoriteSongs.includes(songId)) {
            user.favoriteSongs.push(songId);
            await user.save();
        }

        res.status(200).json(user.favoriteSongs);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

// Remove a song from favorites
const removeFavoriteSong = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.userId;
        const songId = req.body.songId;

        const user = await User.findById(userId);

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        user.favoriteSongs = user.favoriteSongs.filter(id => !id.equals(songId));
        await user.save();

        res.status(200).json(user.favoriteSongs);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

// Create a playlist
const createPlaylist = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.userId;
        const { name, description } = req.body;

        const user = await User.findById(userId);

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        const newPlaylist = new Playlist({
            name,
            description,
            user: user._id,
            songs: [],
        });

        const savedPlaylist = await newPlaylist.save();
        user.playlists.push(savedPlaylist._id as any);
        await user.save();

        res.status(201).json(savedPlaylist);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

// Add a song to a playlist
const addSongToPlaylist = async (req: Request, res: Response): Promise<void> => {
    try {
        const playlistId = req.params.playlistId;
        const songId = req.body.songId;

        const playlist = await Playlist.findById(playlistId);

        if (!playlist) {
            res.status(404).json({ message: 'Playlist not found' });
            return;
        }

        if (!playlist.songs.includes(songId)) {
            playlist.songs.push(songId);
            await playlist.save();
        }

        res.status(200).json(playlist.songs);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

// Remove a song from a playlist
const removeSongFromPlaylist = async (req: Request, res: Response): Promise<void> => {
    try {
        const playlistId = req.params.playlistId;
        const songId = req.body.songId;

        const playlist = await Playlist.findById(playlistId);

        if (!playlist) {
            res.status(404).json({ message: 'Playlist not found' });
            return;
        }

        playlist.songs = playlist.songs.filter(id => !id.equals(songId));
        await playlist.save();

        res.status(200).json(playlist.songs);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

export { addFavoriteSong, removeFavoriteSong, createPlaylist, addSongToPlaylist, removeSongFromPlaylist };
