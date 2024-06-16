import { Request, Response } from 'express';
import { Album, IAlbum } from '../models/album.model';
import { Artist } from '../../artist/models/artist.model';
import { uploadFile } from '../../utils/s3';
import { v4 as uuidv4 } from 'uuid';
import { CreateAlbumDto } from '../dtos/album.dto';
import dotenv from 'dotenv';
import { s3 } from '../../utils/s3';

dotenv.config();

interface MulterRequest extends Request {
    files: {
        albumCover?: Express.Multer.File[];
    };
}

const createAlbum = async (req: Request, res: Response): Promise<void> => {
    try {
        const files = req.files as MulterRequest['files'];
        const albumCoverFile = files?.albumCover;

        if (!albumCoverFile || albumCoverFile.length === 0) {
            res.status(400).send('Album cover image is required.');
            return;
        }

        const albumCover = albumCoverFile[0];
        const albumCoverId = uuidv4();
        const albumCoverFileName = `${albumCoverId}.${albumCover.originalname.split('.').pop()}`;
        await uploadFile(albumCover, albumCoverFileName);
        const albumCoverUrl = `${process.env.CLOUDFRONT_URL}/${albumCoverFileName}`;

        const { artistId, ...albumData }: CreateAlbumDto = req.body;

        const artist = await Artist.findById(artistId);

        if (!artist) {
            res.status(404).send('Artist not found.');
            return;
        }

        const newAlbum: IAlbum = new Album({
            ...albumData,
            artist: artist._id,
            albumCoverUrl,
        });

        const savedAlbum = await newAlbum.save();

        res.status(201).json(savedAlbum);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

const getAlbum = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const album = await Album.findById(id).populate('artist songs');
        if (!album) {
            res.status(404).json({ message: 'Album not found' });
            return;
        }
        res.status(200).json(album);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

const updateAlbum = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const albumData: Partial<CreateAlbumDto> = req.body;
        const updatedAlbum = await Album.findByIdAndUpdate(id, albumData, { new: true }).populate('artist songs');
        if (!updatedAlbum) {
            res.status(404).json({ message: 'Album not found' });
            return;
        }
        res.status(200).json(updatedAlbum);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

const deleteAlbum = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const album = await Album.findByIdAndDelete(id);
        if (!album) {
            res.status(404).json({ message: 'Album not found' });
            return;
        }

        // Optionally delete the album cover from S3
        const s3Params = {
            Bucket: process.env.AWS_BUCKET_NAME!,
            Key: album.albumCoverUrl.split('/').pop()!, // Extract the key from the album cover URL
        };
        await s3.deleteObject(s3Params).promise();

        res.status(200).json({ message: 'Album and cover image deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

const searchAlbums = async (req: Request, res: Response): Promise<void> => {
    try {
        const { q } = req.query;
        const albums = await Album.find({
            $or: [
                { title: { $regex: q as string, $options: 'i' } },
                { genre: { $regex: q as string, $options: 'i' } },
            ],
        }).populate('artist songs');
        res.status(200).json(albums);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

export { createAlbum, getAlbum, updateAlbum, deleteAlbum, searchAlbums };
