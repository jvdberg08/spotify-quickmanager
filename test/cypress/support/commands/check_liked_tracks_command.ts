export default function checkLikedTracks(tracks: Array<string>, include: boolean, accessToken: string
) {
    const headers = {
        'Authorization': 'Bearer ' + accessToken,
    }

    cy.request({
        url: Cypress.env('spotify_api_url') + '/me/tracks/contains?ids=' + tracks.join(','),
        method: 'GET',
        headers: headers
    }).then(response => {
        console.log(response)
        expect(response.body).to.not.include(!include)
    })
}