context('Check Remove Liked Songs Functionality', () => {

    before(() => {
        cy.getAccessToken(true).then(accessToken => {
            cy.saveTracks('tracks1.json', accessToken)
        })
    })

    after(() => {
        cy.getAccessToken(false).then(accessToken => {
            cy.removeTracks('tracks1.json', accessToken)
        })
    })

    it('Check Remove Liked Songs Functionality', () => {

        // Step 1
        cy.fixture('tracks1.json').then(fixture => fixture.tracks.forEach(track => {
            cy.contains('.track-container', track.name)
                .should('be.visible')
                .and('not.have.class', 'track-container-is-selected')
                .click()
                .should('have.class', 'track-container-is-selected')
        }))

        // Step 2
        cy.get('#button-delete').should('be.visible').click()
        cy.get('.modal-dialog').should('be.visible')
        cy.get('.modal-title').should('have.text', 'Please Confirm')
        cy.get('.modal-body').should('have.text',
            'Are you sure you want to remove all selected songs from your Liked Songs?')

        // Step 3
        cy.get('.modal-footer').contains('button', 'Delete').should('be.visible')
        cy.get('.modal-footer').contains('button', 'Cancel').should('be.visible').click()
        cy.get('.modal-dialog').should('not.exist')
        cy.getAccessToken(false).then(accessToken => {
            cy.checkLikedTracks('tracks1.json', true, accessToken)
        })

        // Step 4
        cy.fixture('tracks1.json').then(fixture => fixture.tracks.forEach(track => {
            cy.contains('.track-container', track.name)
                .should('be.visible')
                .and('have.class', 'track-container-is-selected')
        }))

        // Step 4
        cy.get('#button-delete').click()
        cy.get('.modal-dialog').should('be.visible')

        // Step 5
        cy.get('.modal-footer').contains('button', 'Cancel').should('be.visible')
        cy.get('.modal-footer').contains('button', 'Delete').should('be.visible').click()
        cy.get('.modal-dialog').should('be.visible')
        cy.get('.modal-title').should('have.text', 'Success')
        cy.get('.modal-body').should('have.text', 'Successfully removed songs from Liked Songs!')

        // Step 6
        cy.get('.modal-footer').contains('button', 'OK').should('be.visible').click()
        cy.get('.modal-dialog').should('not.exist')

        // Step 7
        cy.getAccessToken(false).then(accessToken => {
            cy.checkLikedTracks('tracks1.json', false, accessToken)
        })
    })
})