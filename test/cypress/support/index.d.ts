declare namespace Cypress {
    interface Chainable {
        getAccessToken(visit: boolean): Chainable

        saveTracks(fixturePath: string, accessToken: string): void

        removeTracks(fixturePath: string, accessToken: string): void

        createPlaylists(fixturePath: string, accessToken: string, callback: (playlists: Array<string>) => any): void

        unfollowPlaylists(playlists: Array<string>, accessToken: string): void

        checkPlaylistsHaveTracks(playlists: Array<string>, tracks: Array<string>, accessToken: string): void

        checkLikedTracks(tracks: Array<string>, include: boolean, accessToken: string): void
    }
}