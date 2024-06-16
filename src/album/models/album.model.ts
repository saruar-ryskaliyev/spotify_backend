import { Document, model, Schema, Types } from 'mongoose';

interface IAlbum extends Document {
    title: string;
    artist: Types.ObjectId;
    releaseDate: Date;
    genre: string;
    albumCoverUrl: string;
    songs: Types.ObjectId[];
}

const albumSchema = new Schema<IAlbum>({
    title: { type: String, required: true },
    artist: { type: Schema.Types.ObjectId, ref: 'Artist', required: true },
    releaseDate: { type: Date, required: true },
    genre: { type: String, required: true },
    albumCoverUrl: { type: String, required: true, unique: true },
    songs: [{ type: Schema.Types.ObjectId, ref: 'Song' }],
});

const Album = model<IAlbum>('Album', albumSchema);

export { Album, IAlbum };
