export default function checkPlaylistsHaveTracks(playlists: Array<string>, tracks: Array<string>, accessToken: string) {
    const headers = {
        'Authorization': 'Bearer ' + accessToken,
    }

    playlists.forEach(async playlist => {
        cy.request({
            url: Cypress.env('spotify_api_url') + '/playlists/' + playlist + '/tracks',
            method: 'GET',
            headers: headers
        }).then(response => {
            const playlistTracks = response.body.items.map(item => item.track.id)
            expect(playlistTracks.join(',')).to.include(tracks.join(','))
        })
    })
}