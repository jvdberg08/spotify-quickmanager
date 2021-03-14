declare namespace Cypress {
    interface Chainable {
        getAccessToken(visit: boolean): Chainable

        saveTracks(tracksFixture: string, accessToken: string): void

        removeTracks(tracksFixture: string, accessToken: string): void

        createPlaylists(playlistsFixture: string, accessToken: string, callback: (playlists: string[]) => any): void

        unfollowPlaylists(playlists: string[], accessToken: string): void

        checkPlaylistsHaveTracks(playlists: string[], tracksFixture: string, accessToken: string): void

        checkLikedTracks(tracksFixture: string, include: boolean, accessToken: string): void

        addTracksToPlaylists(tracksFixture: string, playlists: string[], accessToken: string): void

        removeTracksFromPlaylists(tracksFixture: string, playlists: string[], accessToken: string): void

        getPlaylists(accessToken: string): Chainable
    }
}