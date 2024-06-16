import { Request, Response } from 'express';
import { Song } from '../models/song.model';
import { s3, uploadFile } from '../../utils/s3';
import { CreateSongDto } from '../dtos/song.dto';
import { v4 as uuidv4 } from 'uuid';
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
        const files = req.files as {
            songFile?: Express.Multer.File[];
            coverImage?: Express.Multer.File[];
        };

        const songFiles = files?.songFile;
        const coverImages = files?.coverImage;

        if (!songFiles || !coverImages || songFiles.length === 0 || coverImages.length === 0) {
            res.status(400).send('Song file and cover image are required.');
            return;
        }

        const songFile = songFiles[0];
        const coverImage = coverImages[0];

        const uniqueId = uuidv4();

        // Upload song file
        const songFileExtension = songFile.originalname.split('.').pop();
        const songFileName = `${uniqueId}.${songFileExtension}`;
        await uploadFile(songFile, songFileName);
        const songFileUrl = `${process.env.CLOUDFRONT_URL}/${songFileName}`;

        // Upload cover image
        const coverImageExtension = coverImage.originalname.split('.').pop();
        const coverImageName = `${uniqueId}-cover.${coverImageExtension}`;
        await uploadFile(coverImage, coverImageName);
        const coverImageUrl = `${process.env.CLOUDFRONT_URL}/${coverImageName}`;

        const songData: CreateSongDto = req.body;

        const newSong = new Song({
            uuid: uniqueId,
            ...songData,
            songFileUrl: songFileUrl,
            coverImageUrl: coverImageUrl,
        });

        const savedSong = await newSong.save();
        res.status(201).json(savedSong);
    } catch (error) {
        res.status(500).json({ error: error });
    }
};

const getSong = async (req: Request, res: Response): Promise<void> => {
    try {
        const { uuid } = req.params;
        const song = await Song.findOne({ uuid });
        if (!song) {
            res.status(404).json({ message: 'Song not found' });
            return;
        }
        res.status(200).json(song);
    } catch (error) {
        res.status(500).json({ error: error });
    }
};

const updateSong = async (req: Request, res: Response): Promise<void> => {
    try {
        const { uuid } = req.params;
        const songData: Partial<CreateSongDto> = req.body;
        const updatedSong = await Song.findOneAndUpdate({ uuid }, songData, { new: true });
        if (!updatedSong) {
            res.status(404).json({ message: 'Song not found' });
            return;
        }
        res.status(200).json(updatedSong);
    } catch (error) {
        res.status(500).json({ error: error });
    }
};

const deleteSong = async (req: Request, res: Response): Promise<void> => {
    try {
        const { uuid } = req.params;
        const song = await Song.findOneAndDelete({ uuid });
        if (!song) {
            res.status(404).json({ message: 'Song not found' });
            return;
        }
        // Optionally delete the files from S3
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

        res.status(200).json({ message: 'Song and cover image deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error });
    }
};

export { createSong, getSong, updateSong, deleteSong };
