export interface CreateArtistDto {
    name: string;
    description: string;
}

export interface UpdateArtistDto {
    name?: string;
    description?: string;
    photoUrl?: string; 
}
