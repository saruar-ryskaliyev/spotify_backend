import { Document, model, Schema, Types } from 'mongoose';

interface ISong extends Document {
    _id: Types.ObjectId;
    title: string;
    artist: Types.ObjectId;
    album: Types.ObjectId | null; 
    year: number;
    genre: string;
    songFileUrl: string;
}

const songSchema = new Schema<ISong>({
    title: { type: String, required: true },
    artist: { type: Schema.Types.ObjectId, ref: 'Artist', required: true },
    album: { type: Schema.Types.ObjectId, ref: 'Album', default: null }, 
    year: { type: Number, required: true },
    genre: { type: String, required: true },
    songFileUrl: { type: String, required: true, unique: true },
});

const Song = model<ISong>('Song', songSchema);

export { Song, ISong };
