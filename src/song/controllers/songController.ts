import { Request, Response } from 'express';
import { Song, ISong } from '../models/song.model';
import { Artist, IArtist } from '../../artist/models/artist.model';
import { uploadFile, s3 } from '../../utils/s3';
import { CreateSongDto } from '../dtos/song.dto';
import dotenv from 'dotenv';

dotenv.config();

interface MulterRequest extends Request {
    files: {
        songFile?: Express.Multer.File[];
        coverImage?: Express.Multer.File[];
    };
}

const createSong = async (req: Request, res: Response): Promise<void> => {
    try {
        const files = req.files as MulterRequest['files'];
        const songFiles = files?.songFile;
        const coverImages = files?.coverImage;

        if (!songFiles || !coverImages || songFiles.length === 0 || coverImages.length === 0) {
            res.status(400).send('Song file and cover image are required.');
            return;
        }

        const songFile = songFiles[0];
        const coverImage = coverImages[0];

        const { artistId, ...songData }: CreateSongDto = req.body;

        const artist: IArtist | null = await Artist.findById(artistId);

        if (!artist) {
            res.status(404).send('Artist not found.');
            return;
        }

        // Create new song document to get the MongoDB generated _id
        const newSong: ISong = new Song({
            ...songData,
            artist: artist._id,
        });

        // Use MongoDB generated _id for file names
        const songId = newSong._id.toString();

        // Upload song file
        const songFileExtension = songFile.originalname.split('.').pop();
        const songFileName = `${songId}.${songFileExtension}`;
        await uploadFile(songFile, songFileName);
        const songFileUrl = `${process.env.CLOUDFRONT_URL}/${songFileName}`;

        // Upload cover image
        const coverImageExtension = coverImage.originalname.split('.').pop();
        const coverImageName = `${songId}-cover.${coverImageExtension}`;
        await uploadFile(coverImage, coverImageName);
        const coverImageUrl = `${process.env.CLOUDFRONT_URL}/${coverImageName}`;

        // Update the song document with the file URLs
        newSong.songFileUrl = songFileUrl;
        newSong.coverImageUrl = coverImageUrl;

        const savedSong: ISong = await newSong.save();
        artist.songs.push(savedSong._id); // Push ObjectId
        await artist.save();

        res.status(201).json(savedSong);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

const getSong = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const song: ISong | null = await Song.findById(id).populate('artist');
        if (!song) {
            res.status(404).json({ message: 'Song not found' });
            return;
        }
        res.status(200).json(song);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

const updateSong = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const songData: Partial<CreateSongDto> = req.body;
        const updatedSong: ISong | null = await Song.findByIdAndUpdate(id, songData, { new: true }).populate('artist');
        if (!updatedSong) {
            res.status(404).json({ message: 'Song not found' });
            return;
        }
        res.status(200).json(updatedSong);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

const deleteSong = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const song: ISong | null = await Song.findByIdAndDelete(id);
        if (!song) {
            res.status(404).json({ message: 'Song not found' });
            return;
        }
        
        const s3Params = {
            Bucket: process.env.AWS_BUCKET_NAME!,
            Key: song.songFileUrl.split('/').pop()!, // Extract the key from the song file URL
        };
        await s3.deleteObject(s3Params).promise();

        const s3ParamsCover = {
            Bucket: process.env.AWS_BUCKET_NAME!,
            Key: song.coverImageUrl.split('/').pop()!, // Extract the key from the cover image URL
        };
        await s3.deleteObject(s3ParamsCover).promise();

        // Remove song reference from artist
        const artist: IArtist | null = await Artist.findById(song.artist);
        if (artist) {
            artist.songs = artist.songs.filter((songId) => !songId.equals(song._id)); // Use ObjectId comparison
            await artist.save();
        }

        res.status(200).json({ message: 'Song and cover image deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

const searchSongs = async (req: Request, res: Response): Promise<void> => {
    try {
        const { q } = req.query;
        const songs: ISong[] = await Song.find({
            $or: [
                { title: { $regex: q as string, $options: 'i' } },
                { album: { $regex: q as string, $options: 'i' } },
                { genre: { $regex: q as string, $options: 'i' } },
            ],
        }).populate('artist');
        res.status(200).json(songs);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

export { createSong, getSong, updateSong, deleteSong, searchSongs };
