import Chainable = Cypress.Chainable;

export default function getAccessToken(visit: boolean): Chainable {
    cy.request({
        url: Cypress.env('application_api_url') + '/spotifyauth/get_authorization?client_secret='
            + btoa(Cypress.env('spotify_client_secret')),
        method: 'GET',
    }).then(response => {
        Cypress.env('accessToken', response.body.access_token)
        cy.wrap(response.body.access_token).as('accessToken')
        if (visit) {
            cy.visit('/?authExpiry=' + (new Date().getTime() + 3600 * 1000))
        }
    })

    return cy.get('@accessToken')
}