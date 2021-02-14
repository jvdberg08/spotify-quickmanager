export default function login(): void {
    cy.visit('')
    cy.get('a[id="login-button"]').click()

    cy.url().should('include', Cypress.config().baseUrl)
    cy.get('button[id="logout-button"]').should('be.visible')

    cy.request({
        url: Cypress.env('application_api_url') + '/spotifyauth/get_authorization?client_secret='
            + btoa(Cypress.env('spotify_client_secret')),
        method: 'GET'
    }).then(response => {
        Cypress.env('accessToken', response.body.access_token)
    })
}