import mongoose from 'mongoose';
import {Artist} from '../artist/models/artist.model'; // Adjust the path according to your project structure
import {Album} from '../album/models/album.model'; // Adjust the path according to your project structure

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

    console.log('Artists updated with albums successfully.');
  } catch (error) {
    console.error('Error updating artists with albums:', error);
  }
};

export default updateArtistsWithAlbums;