export interface CreateSongDto {
    title: string;
    artistId: string;
    albumId?: string; 
    year: number;
    genre: string;
}
