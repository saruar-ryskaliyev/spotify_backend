import { Document, model, Schema, Types } from 'mongoose';

interface IArtist extends Document {
    name: string;
    description: string;
    photoUrl: string;
    songs: Types.ObjectId[];
    albums: Types.ObjectId[];
}

const artistSchema = new Schema<IArtist>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    photoUrl: { type: String, required: true, unique: true },
    songs: [{ type: Schema.Types.ObjectId, ref: 'Song' }],
    albums: [{ type: Schema.Types.ObjectId, ref: 'Album' }],
});

const Artist = model<IArtist>('Artist', artistSchema);

export { Artist, IArtist };
