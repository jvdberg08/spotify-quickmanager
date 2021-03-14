import Chainable = Cypress.Chainable;

export default function getPlaylists(accessToken: string): Chainable {
    const headers = {
        'Authorization': 'Bearer ' + accessToken,
    }

    return cy.request({
        url: Cypress.env('spotify_api_url') + '/me/playlists',
        method: 'GET',
        headers: headers
    }).then(response => {
        return response.body.items
    })
}