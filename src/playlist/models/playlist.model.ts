import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IPlaylist extends Document {
    name: string;
    description?: string;
    user: Types.ObjectId;
    songs: Types.ObjectId[];
}

const PlaylistSchema: Schema = new Schema({
    name: { type: String, required: true },
    description: { type: String },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    songs: [{ type: Schema.Types.ObjectId, ref: 'Song' }],
});

export default mongoose.model<IPlaylist>('Playlist', PlaylistSchema);


// import { Document, model, Schema, Types } from 'mongoose';

// interface IAlbum extends Document {
//     title: string;
//     artist: Types.ObjectId;
//     releaseDate: Date;
//     genre: string;
//     albumCoverUrl: string;
//     songs: Types.ObjectId[];
// }

// const albumSchema = new Schema<IAlbum>({
//     title: { type: String, required: true },
//     artist: { type: Schema.Types.ObjectId, ref: 'Artist', required: true },
//     releaseDate: { type: Date, required: true },
//     genre: { type: String, required: true },
//     albumCoverUrl: { type: String, required: true, unique: true },
//     songs: [{ type: Schema.Types.ObjectId, ref: 'Song' }],
// });

// const Album = model<IAlbum>('Album', albumSchema);

// export { Album, IAlbum };
