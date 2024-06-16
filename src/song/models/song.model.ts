import { Document, model, Schema } from 'mongoose';

interface ISong extends Document {
    uuid: string;
    title: string;
    artist: string;
    album: string;
    year: number;
    genre: string;
    songFileUrl: string;
    coverImageUrl: string;
}

const songSchema = new Schema<ISong>({
    uuid: { type: String, required: true, unique: true},
    title: { type: String, required: true },
    artist: { type: String, required: true },
    album: { type: String, required: true },
    year: { type: Number, required: true },
    genre: { type: String, required: true },
    songFileUrl: { type: String, required: true, unique: true },
    coverImageUrl: { type: String, required: true, unique: true },
});

const Song = model<ISong>('Song', songSchema);

export { Song, ISong };
