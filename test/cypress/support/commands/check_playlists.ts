export default function checkPlaylists(playlists: string[], include: boolean, accessToken: string) {
    const headers = {
        'Authorization': 'Bearer ' + accessToken,
    }

    cy.request({
        url: Cypress.env('spotify_api_url') + '/me/playlists',
        method: 'GET',
        headers: headers
    }).then(response => {
        const userPlaylists = response.body.items.map(item => item.id).join(',')
        if (include) {
            expect(userPlaylists).to.include(playlists.join(','))
        } else {
            expect(userPlaylists).to.not.include(playlists.join(','))
        }
    })
}