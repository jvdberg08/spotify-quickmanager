context('Check Add Songs To Playlists Functionality', () => {

    before(() => {
        cy.getAccessToken(true).then(accessToken => {
            cy.saveTracks('tracks1.json', accessToken)
            cy.createPlaylists('playlists1.json', accessToken, (playlists) => {
                this.playlists = playlists
            })
        })
    })

    after(() => {
        cy.getAccessToken(false).then(accessToken => {
            cy.removeTracks('tracks1.json', accessToken)
            cy.unfollowPlaylists(this.playlists, accessToken)
        })
    })

    it('Check Add Songs To Playlists Functionality', () => {

        // Step 1
        cy.fixture('tracks1.json').then(fixture => fixture.tracks.forEach(track => {
            cy.contains('.track-container', track.name)
                .should('be.visible')
                .and('not.have.class', 'track-container-is-selected')
                .click()
                .should('have.class', 'track-container-is-selected')
        }))

        // Step 2 - 3
        cy.get('#actions-dropdown-button')
            .should('be.visible').click()
        cy.contains('a', 'Add Selected To Playlist')
            .should('be.visible').click()
        cy.get('#add-songs-to-playlist-modal').should('be.visible')

        // Step 4
        cy.fixture('playlists1.json').then(fixture => fixture.playlists.forEach(playlist => {
            cy.contains('.playlist-container', playlist.name)
                .should('be.visible')
                .and('not.have.class', 'playlist-container-is-selected')
                .click()
                .should('have.class', 'playlist-container-is-selected')
        }))

        // Step 5
        cy.get('.modal-footer').contains('button', 'Cancel').should('be.visible')
        cy.get('.modal-footer').contains('button', 'OK').should('be.visible').click()
        cy.get('.modal-dialog').should('be.visible')
        cy.get('.modal-title').should('have.text', 'Success')
        cy.get('.modal-body').should('have.text', 'Successfully added songs to the playlists!')

        // Step 6
        cy.get('.modal-footer').contains('button', 'OK').should('be.visible').click()
        cy.get('.modal-dialog').should('not.exist')

        // Step 7
        cy.fixture('tracks1.json').then(fixture => {
            cy.getAccessToken(false).then(accessToken => {
                cy.checkPlaylistsHaveTracks(this.playlists, fixture.tracks.map(track => track.id), accessToken)
            })
        })
    })
})