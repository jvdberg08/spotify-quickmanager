export interface Playlist {
    id: string;
    name: string;
    description: string;
    public: boolean;
    collaborative: boolean;
    images: Array<{ url: string }>;

}

export interface Track {
    id: string;
    name: string;
    duration: number;
    album: Album;
    artists: Array<Artist>;
}

export interface Artist {
    id: string;
    name: string;
}

export interface Album {
    id: string;
    name: string;
    type: AlbumType;
    artists: Array<Artist>;
    images: Array<{ width: number; height: number; url: string }>;
}

enum AlbumType {
    Single = "single",
    Album = "album"
}