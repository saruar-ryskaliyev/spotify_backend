import { Request, Response } from 'express';
import { Song } from '../models/song.model';
import { uploadFile } from '../../utils/s3';
import { CreateSongDto } from '../dtos/song.dto';

const createSong = async (req: Request, res: Response): Promise<void> => {
    try {
        const file = req.file;
        if (!file) {
            res.status(400).send('No file uploaded.');
            return;
        }

        const uploadResult = await uploadFile(file);

        const songData: CreateSongDto = req.body;
        const newSong = new Song({
            ...songData,
            fileUrl: uploadResult.Location,
        });

        const savedSong = await newSong.save();
        res.status(201).json(savedSong);
    } catch (error) {
        res.status(500).json({ error: error });
    }
};



// Implement other CRUD operations (get, update, delete) similarly

export { createSong };
