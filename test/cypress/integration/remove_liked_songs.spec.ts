before(() => {
    cy.getSpotifyAuthorization((accessToken: string) => {
        this.accessToken = accessToken
        cy.saveTracks('tracks1.json', accessToken)
    })
    cy.login()
})

after(() => {
    cy.removeTracks('tracks1.json', this.accessToken)
})

it('Check Remove Liked Songs Functionality', () => {

    // Step 1
    cy.fixture('tracks1.json').then(fixture => fixture.tracks.forEach(track => {
        cy.contains('.song-container', track.name)
            .should('be.visible')
            .and('not.have.class', 'song-container-is-selected')
            .click()
            .should('have.class', 'song-container-is-selected')
    }))

    // Step 2 - 3
    cy.get('#actions-dropdown-button')
        .should('be.visible').click()
    cy.contains('a', 'Remove Selected from Liked Songs')
        .should('be.visible').click()
    cy.get('.modal-dialog').should('be.visible')
    cy.get('.modal-title').should('have.text', 'Please Confirm')
    cy.get('.modal-body').should('have.text',
        'Are you sure you want to remove all selected songs from your Liked Songs?')

    // Step 4
    cy.get('.modal-footer').contains('button', 'Delete').should('be.visible')
    cy.get('.modal-footer').contains('button', 'Cancel').should('be.visible').click()
    cy.get('.modal-dialog').should('not.exist')
    cy.fixture('tracks1.json').then(fixture => {
        cy.checkLikedTracks(fixture.tracks.map(track => track.id), true, this.accessToken)
    })

    // Step 5
    cy.fixture('tracks1.json').then(fixture => fixture.tracks.forEach(track => {
        cy.contains('.song-container', track.name)
            .should('be.visible')
            .and('have.class', 'song-container-is-selected')
    }))
    cy.get('#actions-dropdown-button').click()

    // Step 6
    cy.contains('a', 'Remove Selected from Liked Songs').click()
    cy.get('.modal-dialog').should('be.visible')

    // Step 7
    cy.get('.modal-footer').contains('button', 'Cancel').should('be.visible')
    cy.get('.modal-footer').contains('button', 'Delete').should('be.visible').click()
    cy.get('.modal-dialog').should('be.visible')
    cy.get('.modal-title').should('have.text', 'Success')
    cy.get('.modal-body').should('have.text', 'Successfully removed songs from Liked Songs!')

    // Step 8
    cy.get('.modal-footer').contains('button', 'OK').should('be.visible').click()
    cy.get('.modal-dialog').should('not.exist')

    // Step 9
    cy.fixture('tracks1.json').then(fixture => {
        cy.checkLikedTracks(fixture.tracks.map(track => track.id), false, this.accessToken)
    })

})