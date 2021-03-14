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
        cy.get('#button-refresh').should('be.visible').click()

        // Step 3
        cy.fixture('tracks1.json').then(fixture => fixture.tracks.forEach(track => {
            cy.contains('.track-container', track.name)
                .should('be.visible')
                .and('not.have.class', 'track-container-is-selected')
                .click()
                .should('be.visible')
                .and('have.class', 'track-container-is-selected')
        }))

        // Step 4
        cy.get('#button-playlist-add').should('be.visible').click()
        cy.get('#add-songs-to-playlist-modal').should('be.visible')

        // Step 5
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

        // Step 6
        cy.get('.modal-dialog').find('#button-refresh').should('be.visible').click()
        cy.fixture('playlists1.json').then(fixture => fixture.playlists.forEach(playlist => {
            cy.contains('.playlist-container', playlist.name)
                .should('be.visible')
        }))

        // Step 7
        cy.contains('button', 'Cancel').should('be.visible').click()
        cy.get('#add-songs-to-playlist-modal').should('not.exist')

        // Step 8
        cy.getAccessToken(false).then(accessToken => {
            cy.unfollowPlaylists(this.playlists, accessToken)
        })

        // Step 9
        cy.get('#navbar-items-playlists').should('be.visible').click()

        // Step 10
        cy.fixture('playlists1.json').then(fixture => fixture.playlists.forEach(playlist => {
            cy.contains('.playlist-container', playlist.name)
                .should('not.exist')
        }))
        cy.getAccessToken(false).then(accessToken => {
            cy.createPlaylists('playlists1.json', accessToken, (playlists => this.playlists = playlists))
        })

        // Step 11
        cy.get('#button-refresh').should('be.visible').click()
        cy.fixture('playlists1.json').then(fixture => fixture.playlists.forEach(playlist => {
            cy.contains('.playlist-container', playlist.name)
                .should('be.visible')
                .and('not.have.class', 'playlist-container-is-selected')
        }))

        // Step 12
        cy.getAccessToken(false).then(accesstoken => {
            cy.addTracksToPlaylists('tracks1.json', this.playlists, accesstoken)
        })

        // Step 13
        cy.fixture('playlists1.json').then(fixture => {
            cy.contains('.playlist-container', fixture.playlists[0].name)
                .click()
                .should('be.visible')
                .and('have.class', 'playlist-container-is-selected')
        })

        // Step 14
        cy.get('#button-edit').should('be.visible').click()
        cy.get('#edit-playlist-modal').should('be.visible')

        // Step 15
        cy.get('#edit-playlist-modal').get('.modal-body').scrollTo('bottom')
        cy.fixture('tracks1.json').then(fixture => fixture.tracks.forEach(track => {
            cy.contains('.track-container', track.name).should('be.visible')
            cy.getAccessToken(false).then(accessToken => {
                cy.removeTracksFromPlaylists('tracks1.json', this.playlists, accessToken)
            })
            cy.contains('.track-container', track.name).should('be.visible')
        }))

        // Step 16
        cy.get('.modal-dialog').find('#button-refresh').should('be.visible').click()
        cy.fixture('tracks1.json').then(fixture => fixture.tracks.forEach(track => {
            cy.contains('.track-container', track.name).should('not.exist')
        }))
    })
})