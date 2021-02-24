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
            cy.contains('.track-container', track.name)
                .should('not.exist')
        }))
        cy.getAccessToken(false).then(accessToken => {
            cy.saveTracks('tracks1.json', accessToken)
        })

        // Step 2
        cy.get('#actions-dropdown-button').should('be.visible').click()
            .contains('a', 'Refresh').should('be.visible')

        // Step 3 & 4
        cy.contains('a', 'Refresh').click()
        cy.fixture('tracks1.json').then(fixture => fixture.tracks.forEach(track => {
            cy.contains('.track-container', track.name)
                .should('be.visible')
                .and('not.have.class', 'track-container-is-selected')
                .click()
                .should('be.visible')
                .and('have.class', 'track-container-is-selected')
        }))

        // Step 5
        cy.get('#actions-dropdown-button').should('be.visible').click()
            .contains('a', 'Add Selected To Playlist').should('be.visible')

        // Step 6
        cy.contains('a', 'Add Selected To Playlist').click()
        cy.get('#add-songs-to-playlist-modal').should('be.visible')

        // Step 7
        cy.fixture('playlists1.json').then(fixture => {
            fixture.playlists.forEach(playlist => {
                cy.contains('.playlist-container', playlist.name)
                    .should('not.exist')
            })
            cy.getAccessToken(false).then(accessToken => {
                cy.createPlaylists('playlists1.json', accessToken, (playlists => this.playlists = playlists))
            })
            fixture.playlists.forEach(playlist => {
                cy.contains('.playlist-container', playlist.name)
                    .should('not.exist')
            })
        })

        // Step 8
        cy.get('#refresh-button').should('be.visible').click()
        cy.fixture('playlists1.json').then(fixture => fixture.playlists.forEach(playlist => {
            cy.contains('.playlist-container', playlist.name)
                .should('be.visible')
        }))

        // Step 9
        cy.contains('button', 'Cancel').should('be.visible').click()
        cy.get('#add-songs-to-playlist-modal').should('not.exist')

        // Step 10
        cy.getAccessToken(false).then(accessToken => {
            cy.unfollowPlaylists(this.playlists, accessToken)
        })

        // Step 11
        cy.get('#navigation-playlists').should('be.visible').click()

        // Step 12
        cy.fixture('playlists1.json').then(fixture => fixture.playlists.forEach(playlist => {
            cy.contains('.playlist-container', playlist.name)
                .should('not.exist')
        }))
        cy.getAccessToken(false).then(accessToken => {
            cy.createPlaylists('playlists1.json', accessToken, (playlists => this.playlists = playlists))
        })

        // Step 13
        cy.get('#actions-dropdown-button').should('be.visible').click()
            .contains('a', 'Refresh').should('be.visible')

        // Step 14
        cy.contains('a', 'Refresh').click()
        cy.fixture('playlists1.json').then(fixture => fixture.playlists.forEach(playlist => {
            cy.contains('.playlist-container', playlist.name)
                .should('be.visible')
                .and('not.have.class', 'playlist-container-is-selected')
        }))

        // Step 15
        cy.getAccessToken(false).then(accesstoken => {
            cy.addTracksToPlaylists('tracks1.json', this.playlists, accesstoken)
        })

        // Step 16
        cy.fixture('playlists1.json').then(fixture => {
            cy.contains('.playlist-container', fixture.playlists[0].name)
                .click()
                .should('be.visible')
                .and('have.class', 'playlist-container-is-selected')
        })

        // Step 17
        cy.get('#actions-dropdown-button').should('be.visible').click()
            .contains('a', 'Edit').should('be.visible')

        // Step 18
        cy.contains('a', 'Edit').click()
        cy.get('#edit-playlist-modal').should('be.visible')

        // Step 19
        cy.get('#edit-playlist-modal').get('.modal-body').scrollTo('bottom')
        cy.fixture('tracks1.json').then(fixture => fixture.tracks.forEach(track => {
            cy.contains('.track-container', track.name).should('be.visible')
            cy.getAccessToken(false).then(accessToken => {
                cy.removeTracksFromPlaylists('tracks1.json', this.playlists, accessToken)
            })
            cy.contains('.track-container', track.name).should('be.visible')
        }))

        // Step 20
        cy.get('#refresh-button').should('be.visible').click()
        cy.fixture('tracks1.json').then(fixture => fixture.tracks.forEach(track => {
            cy.contains('.track-container', track.name).should('not.exist')
        }))
    })
})