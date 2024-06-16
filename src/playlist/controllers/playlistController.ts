import { Request, Response } from 'express';
import { Types } from 'mongoose';
import Playlist from '../models/playlist.model';
import User from '../../auth/models/User';

// Create a playlist
const createPlaylist = async (req: Request, res: Response): Promise<void> => {
    console.log('createPlaylist');
    try {
        const userId = (req as any).user.userId;  // Extracted from JWT middleware
        const { name, description } = req.body;


        if (!Types.ObjectId.isValid(userId)) {
            res.status(400).json({ message: 'Invalid user ID' });
            return;
        }

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
        user.playlists.push(savedPlaylist._id);
        await user.save();

        res.status(201).json(savedPlaylist);
    } catch (error) {
        console.log('Error in createPlaylist:', error);
        res.status(500).json({ error: (error as Error).message });
    }
};

// Get all playlists for a user
const getUserPlaylists = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user.userId;  // Extracted from JWT middleware

        if (!Types.ObjectId.isValid(userId)) {
            res.status(400).json({ message: 'Invalid user ID' });
            return;
        }

        const playlists = await Playlist.find({ user: userId }).populate('songs');

        res.status(200).json(playlists);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

// Add a song to a playlist
const addSongToPlaylist = async (req: Request, res: Response): Promise<void> => {
    try {
        const { playlistId } = req.params;
        const { songId } = req.body;
        const userId = (req as any).user.userId;  // Extracted from JWT middleware

        if (!Types.ObjectId.isValid(playlistId) || !Types.ObjectId.isValid(songId)) {
            res.status(400).json({ message: 'Invalid playlist or song ID' });
            return;
        }

        const playlist = await Playlist.findOne({ _id: playlistId, user: userId });

        if (!playlist) {
            res.status(404).json({ message: 'Playlist not found' });
            return;
        }

        const songObjectId = new Types.ObjectId(songId);

        if (!playlist.songs.includes(songObjectId)) {
            playlist.songs.push(songObjectId);
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
        const { playlistId } = req.params;
        const { songId } = req.body;
        const userId = (req as any).user.userId;  // Extracted from JWT middleware

        if (!Types.ObjectId.isValid(playlistId) || !Types.ObjectId.isValid(songId)) {
            res.status(400).json({ message: 'Invalid playlist or song ID' });
            return;
        }

        const playlist = await Playlist.findOne({ _id: playlistId, user: userId });

        if (!playlist) {
            res.status(404).json({ message: 'Playlist not found' });
            return;
        }

        const songObjectId = new Types.ObjectId(songId);

        playlist.songs = playlist.songs.filter(id => !id.equals(songObjectId));
        await playlist.save();

        res.status(200).json(playlist.songs);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

// Delete a playlist
const deletePlaylist = async (req: Request, res: Response): Promise<void> => {
    try {
        const { playlistId } = req.params;
        const userId = (req as any).user.userId;  // Extracted from JWT middleware

        if (!Types.ObjectId.isValid(playlistId)) {
            res.status(400).json({ message: 'Invalid playlist ID' });
            return;
        }

        const playlist = await Playlist.findOneAndDelete({ _id: playlistId, user: userId });

        if (!playlist) {
            res.status(404).json({ message: 'Playlist not found' });
            return;
        }

        // Remove playlist reference from user
        const user = await User.findById(playlist.user);
        if (user) {
            user.playlists = user.playlists.filter(id => !id.equals(playlist._id));
            await user.save();
        }

        res.status(200).json({ message: 'Playlist deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

export { createPlaylist, getUserPlaylists, addSongToPlaylist, removeSongFromPlaylist, deletePlaylist };
