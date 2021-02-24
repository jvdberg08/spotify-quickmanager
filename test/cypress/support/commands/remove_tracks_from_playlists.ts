export default function removeTracksFromPlaylists(tracksFixture: string, playlists: string[], accessToken: string) {
    cy.fixture(tracksFixture).then(fixture => {
        const headers = {
            'Authorization': 'Bearer ' + accessToken,
            'Content-Type': 'application/json'
        }

        playlists.forEach(async playlist => {
            cy.request({
                url: Cypress.env('spotify_api_url') + '/playlists/' + playlist + '/tracks',
                method: 'DELETE',
                headers: headers,
                body: {
                    uris: fixture.tracks.map(track => 'spotify:track:' + track.id)
                }
            })
        })
    })
}