import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IUser extends Document {
  email: string;
  username?: string;
  password: string;
  favoriteSongs: Types.ObjectId[];
  playlists: Types.ObjectId[];
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String },
  password: { type: String, required: true },
  favoriteSongs: [{ type: Schema.Types.ObjectId, ref: 'Song' }],
  playlists: [{ type: Schema.Types.ObjectId, ref: 'Playlist' }],
});

export default mongoose.model<IUser>('User', UserSchema);
