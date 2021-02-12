import Chainable = Cypress.Chainable;
import Response = Cypress.Response;

export default function getSpotifyAuthorization(callback: (accessToken: string) => any) {
    getSpotifyAuthCode().then(location => {
        const code = location.search.substr(6, location.search.length)
        getSpotifyAccessToken(code).then(response => {
            callback(response.body.access_token)
        })
    })
}

function getSpotifyAuthCode(): Chainable<Location> {
    const clientId = Cypress.env('spotify_client_id')
    const clientScope = Cypress.env('spotify_client_scope')
    const redirectUri = Cypress.env('spotify_redirect_url')
    const params = new URLSearchParams({
        'client_id': clientId,
        'scope': clientScope,
        'redirect_uri': redirectUri,
        'response_type': 'code'
    }).toString()

    cy.visit(Cypress.env('spotify_authorize_url') + '?' + params)
    cy.url().then(url => {
        if (url.includes('https://accounts.spotify.com')) {
            cy.get('input[id="login-username"').type(Cypress.env('spotify_username'))
            cy.get('input[id="login-password"').type(Cypress.env('spotify_password'))
            cy.get('button[id="login-button"]').click()
            cy.wait(2500)
            cy.get('body').then(body => {
                if (body.find('button[id="auth-accept"]').length > 0)
                    cy.get('button[id="auth-accept"]').click()
            })
        }
    })
    cy.url().should('include', Cypress.config().baseUrl)
    return cy.location()
}

function getSpotifyAccessToken(code): Chainable<Response> {
    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + btoa(Cypress.env('spotify_client_id') + ':'
            + Cypress.env('spotify_client_secret'))
    }
    const data = new URLSearchParams({
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': Cypress.env('spotify_redirect_url')
    }).toString()
    return cy.request({
        url: Cypress.env('spotify_token_url'),
        method: 'POST',
        body: data,
        headers: headers
    });
}