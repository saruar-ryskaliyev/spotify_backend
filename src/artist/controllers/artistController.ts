import { Request, Response } from 'express';
import { Artist } from '../models/artist.model';
import { uploadFile } from '../../utils/s3';
import { CreateArtistDto, UpdateArtistDto } from '../dtos/artist.dto';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import Album from '../../album/models/album.model';

dotenv.config();

interface MulterRequest extends Request {
    files: {
        photo?: Express.Multer.File[];
    };
}

const createArtist = async (req: Request, res: Response): Promise<void> => {
    try {
        const files = req.files as MulterRequest['files'];
        const photoFile = files?.photo;

        if (!photoFile || photoFile.length === 0) {
            res.status(400).send('Artist photo is required.');
            return;
        }

        const photo = photoFile[0];
        const uniqueId = uuidv4();
        const photoFileName = `${uniqueId}.${photo.originalname.split('.').pop()}`;
        await uploadFile(photo, photoFileName);
        const photoUrl = `${process.env.CLOUDFRONT_URL}/${photoFileName}`;

        const artistData: CreateArtistDto = req.body;

        const newArtist = new Artist({
            ...artistData,
            photoUrl,
        });

        const savedArtist = await newArtist.save();
        res.status(201).json(savedArtist);
    } catch (error) {
        res.status(500).json({ error: error });
    }
};

const updateArtist = async (req: Request, res: Response): Promise<void> => {
    try {
        const files = req.files as MulterRequest['files'];
        const { id } = req.params;
        const artistData: UpdateArtistDto = req.body;

        let updateData: UpdateArtistDto = { ...artistData };

        if (files?.photo) {
            const photo = files.photo[0];
            const uniqueId = uuidv4();
            const photoFileName = `${uniqueId}.${photo.originalname.split('.').pop()}`;
            await uploadFile(photo, photoFileName);
            const photoUrl = `${process.env.CLOUDFRONT_URL}/${photoFileName}`;
            updateData.photoUrl = photoUrl;
        }

        const updatedArtist = await Artist.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedArtist) {
            res.status(404).json({ message: 'Artist not found' });
            return;
        }

        res.status(200).json(updatedArtist);
    } catch (error) {
        res.status(500).json({ error: error });
    }
};

const getArtists = async (req: Request, res: Response): Promise<void> => {
    try {
        const artists = await Artist.find().populate('songs');
        res.status(200).json(artists);
    } catch (error) {
        res.status(500).json({ error: error });
    }
};

const searchArtists = async (req: Request, res: Response): Promise<void> => {
    try {
        const { q } = req.query;
        const artists = await Artist.find({
            $or: [
                { name: { $regex: q as string, $options: 'i' } },
                { description: { $regex: q as string, $options: 'i' } },
            ],
        }).populate('songs');
        res.status(200).json(artists);
    } catch (error) {
        res.status(500).json({ error: error });
    }
};

const getArtistById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const artist = await Artist.findById(id).populate('songs');
        if (!artist) {
            res.status(404).json({ message: 'Artist not found' });
            return;
        }
        res.status(200).json(artist);
    } catch (error) {
        res.status(500).json({ error: error });
    }
}

export { createArtist, updateArtist, getArtists, searchArtists, getArtistById };
