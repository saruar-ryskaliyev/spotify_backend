import { Document, model, Schema, Types } from 'mongoose';

interface ISong extends Document {
    _id: Types.ObjectId;
    title: string;
    artist: Types.ObjectId;
    album: string;
    year: number;
    genre: string;
    songFileUrl: string;
    coverImageUrl: string;
}

const songSchema = new Schema<ISong>({
    title: { type: String, required: true },
    artist: { type: Schema.Types.ObjectId, ref: 'Artist', required: true },
    album: { type: String, required: true },
    year: { type: Number, required: true },
    genre: { type: String, required: true },
    songFileUrl: { type: String, required: true, unique: true },
    coverImageUrl: { type: String, required: true, unique: true },
});

const Song = model<ISong>('Song', songSchema);

export { Song, ISong };
