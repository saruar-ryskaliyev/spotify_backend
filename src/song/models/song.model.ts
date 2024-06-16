import { Document, model, Schema } from 'mongoose';

interface ISong extends Document {
    title: string;
    artist: string;
    album: string;
    year: number;
    genre: string;
    fileUrl: string;
}

const songSchema = new Schema<ISong>({
    title: { type: String, required: true },
    artist: { type: String, required: true },
    album: { type: String, required: true },
    year: { type: Number, required: true },
    genre: { type: String, required: true },
    fileUrl: { type: String, required: true },
});

const Song = model<ISong>('Song', songSchema);

export { Song, ISong };
