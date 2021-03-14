context('Check Unfollow Playlists Functionality', () => {

    before(() => {
        cy.getAccessToken(true).then(accessToken => {
            cy.createPlaylists('playlists1.json', accessToken, (playlists => this.playlists = playlists))
        })
    })

    it('Check Unfollow Playlists Functionality', () => {

        // Step 1
        cy.get('#navbar-items-playlists').should('be.visible').click()

        // Step 2
        cy.fixture('playlists1.json').then(fixture => fixture.playlists.forEach(playlist => {
            cy.contains('.playlist-container', playlist.name)
                .should('be.visible')
                .and('not.have.class', 'playlist-container-is-selected')
                .click()
                .should('be.visible')
                .and('have.class', 'playlist-container-is-selected')
        }))

        // Step 3
        cy.get('#button-delete').should('be.visible').click()
        cy.get('.modal-dialog').should('be.visible')
        cy.get('.modal-title').should('have.text', 'Please Confirm')
        cy.get('.modal-body').should('have.text',
            'Are you sure you want to unfollow all selected playlists?')

        // Step 4
        cy.contains('button', 'Unfollow').should('be.visible')
        cy.contains('button', 'Cancel').should('be.visible').click()
        cy.fixture('playlists1.json').then(fixture => fixture.playlists.forEach(playlist => {
            cy.contains('.playlist-container', playlist.name)
                .should('be.visible')
                .and('have.class', 'playlist-container-is-selected')
        }))

        // Step 5
        cy.get('#button-delete').should('be.visible').click()
        cy.get('.modal-dialog').should('be.visible')

        // Step 6
        cy.contains('button', 'Unfollow').click()
        cy.get('.modal-dialog').should('be.visible')
        cy.get('.modal-title').should('have.text', 'Success')
        cy.get('.modal-body').should('have.text', 'Successfully unfollowed these playlists!')

        // Step 7
        cy.contains('button', 'OK').should('be.visible').click()
        cy.get('.modal-dialog').should('not.exist')

        // Step 8
        cy.getAccessToken(false).then(accessToken => {
            cy.checkPlaylists(this.playlists, false, accessToken)
        })
    })
})