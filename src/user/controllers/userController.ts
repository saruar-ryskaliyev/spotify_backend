import { Request, Response } from 'express';
import User from '../../auth/models/User';
import {Song} from '../../song/models/song.model';
import {Album} from '../../album/models/album.model';
import {Artist} from '../../artist/models/artist.model';




const getFavoriteSongs = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user.id;  // Extracted from JWT middleware
        const user = await User.findById(userId).populate('favoriteSongs');
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.status(200).json(user.favoriteSongs);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

// Add a song to favorites
const addFavoriteSong = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user.id;  // Extracted from JWT middleware
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
        const userId = (req as any).user.id;  // Extracted from JWT middleware
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

const globalSearch = async (req: Request, res: Response): Promise<void> => {
    try {
        const { q } = req.query;

        const songResults = await Song.find({
            $or: [
                { title: { $regex: q as string, $options: 'i' } },
                { genre: { $regex: q as string, $options: 'i' } },
           
            ],
        }).populate('artist').populate('album');

        const albumResults = await Album.find({
            $or: [
                { title: { $regex: q as string, $options: 'i' } },
                { genre: { $regex: q as string, $options: 'i' } },
            ],
        }).populate('artist').populate('songs');

        const artistResults = await Artist.find({
            $or: [
                { name: { $regex: q as string, $options: 'i' } },
                { description: { $regex: q as string, $options: 'i' } },
            ],
        }).populate('songs').populate('albums');

        const results = {
            songs: songResults,
            albums: albumResults,
            artists: artistResults,
        };

        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};


export { addFavoriteSong, removeFavoriteSong, getFavoriteSongs, globalSearch };
