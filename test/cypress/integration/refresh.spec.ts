context('Check Refresh Functionality', () => {

    before(() => {
        cy.getAccessToken(true)
    })

    after(() => {
        cy.getAccessToken(false).then(accessToken => {
            cy.removeTracks('tracks1.json', accessToken)
            cy.unfollowPlaylists(this.playlists, accessToken)
        })
    })

    it('Check Refresh Functionality', () => {

        // Step 1
        cy.fixture('tracks1.json').then(fixture => fixture.tracks.forEach(track => {
            cy.contains('.song-container', track.name)
                .should('not.exist')
        }))
        cy.getAccessToken(false).then(accessToken => {
            cy.saveTracks('tracks1.json', accessToken)
        })

        // Step 2
        cy.get('#actions-dropdown-button').should('be.visible').click()
            .contains('a', 'Refresh').should('be.visible')

        // Step 3
        cy.contains('a', 'Refresh').click()
        cy.fixture('tracks1.json').then(fixture => fixture.tracks.forEach(track => {
            cy.contains('.song-container', track.name)
                .should('be.visible')
                .and('not.have.class', 'song-container-is-selected')
        }))

        // Step 4
        cy.get('#navigation-playlists').should('be.visible').click()

        // Step 5
        cy.fixture('playlists1.json').then(fixture => fixture.playlists.forEach(playlist => {
            cy.contains('.playlist-container', playlist.name)
                .should('not.exist')
        }))
        cy.getAccessToken(false).then(accessToken => {
            cy.createPlaylists('playlists1.json', accessToken, (playlists => this.playlists = playlists))
        })

        // Step 6
        cy.get('#actions-dropdown-button').should('be.visible').click()
            .contains('a', 'Refresh').should('be.visible')

        // Step 7
        cy.contains('a', 'Refresh').click()
        cy.fixture('playlists1.json').then(fixture => fixture.playlists.forEach(playlist => {
            cy.contains('.playlist-container', playlist.name)
                .should('be.visible')
                .and('not.have.class', 'playlist-container-is-selected')
        }))
    })

})