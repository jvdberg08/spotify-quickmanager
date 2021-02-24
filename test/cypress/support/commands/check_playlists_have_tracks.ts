export default function checkPlaylistsHaveTracks(playlists: string[], tracksFixture: string, accessToken: string) {
    cy.fixture(tracksFixture).then(fixture => {
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
                expect(playlistTracks.join(',')).to.include(fixture.tracks.map(track => track.id).join(','))
            })
        })
    })
}