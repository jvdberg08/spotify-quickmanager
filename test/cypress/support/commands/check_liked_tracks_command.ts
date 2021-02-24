export default function checkLikedTracks(tracksFixture: string, include: boolean, accessToken: string) {
    cy.fixture(tracksFixture).then(fixture => {
        const headers = {
            'Authorization': 'Bearer ' + accessToken,
        }

        cy.request({
            url: Cypress.env('spotify_api_url') + '/me/tracks/contains?ids=' + fixture.tracks.map(track => track.id).join(','),
            method: 'GET',
            headers: headers
        }).then(response => {
            expect(response.body).to.not.include(!include)
        })
    })
}