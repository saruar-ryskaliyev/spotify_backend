import mongoose from 'mongoose';
import {Artist} from '../artist/models/artist.model'; // Adjust the path according to your project structure
import {Album} from '../album/models/album.model'; // Adjust the path according to your project structure
import {Song} from '../song/models/song.model'; // Adjust the path according to your project structure


const updateArtistsWithAlbums = async () => {
  try {
    

    const albums = await Album.find();

    for (const album of albums) {
      await Artist.findByIdAndUpdate(
        album.artist,
        { $addToSet: { albums: album._id } },
        { new: true }
      );
    }

  } catch (error) {
    console.error('Error updating artists with albums:', error);
  }
};


const updateSongReferences = async () => {
  try {
   

    const songs = await Song.find().populate('artist').populate('album');

    for (const song of songs) {
      const artist = await Artist.findById(song.artist);
      if (artist && !artist.songs.includes(song._id)) {
        artist.songs.push(song._id);
        await artist.save();
      }

      if (song.album) {
        const album = await Album.findById(song.album);
        if (album && !album.songs.includes(song._id)) {
          album.songs.push(song._id);
          await album.save();
        }
      }
    }

    mongoose.connection.close();
  } catch (error) {
    console.error('Error updating song references:', error);
    mongoose.connection.close();
  }
};



export default updateSongReferences;