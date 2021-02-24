export default function removeTracks(tracksFixture: string, accessToken: string) {
    cy.fixture(tracksFixture).then(fixture => {
        const data = {
            'ids': fixture.tracks.map(track => track.id)
        }
        const headers = {
            'Authorization': 'Bearer ' + accessToken,
            'Content-Type': 'application/json'
        }

        cy.request({
            url: Cypress.env('spotify_api_url') + '/me/tracks',
            method: 'DELETE',
            body: data,
            headers: headers
        })
    })
}