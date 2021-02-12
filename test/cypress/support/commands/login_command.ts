export default function login() {
    cy.visit('')
    cy.get('a[id="login-button"]').click()
    cy.url().should('include', Cypress.config().baseUrl)
    cy.get('button[id="logout-button"]').should('be.visible')
}