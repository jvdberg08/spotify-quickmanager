context('Check Make Playlists Public/Private, Collaborative/NonCollaborative Functionality', () => {

    before(() => {
        cy.getAccessToken(true).then(accessToken => {
            cy.createPlaylists('playlists1.json', accessToken, (playlists => this.playlists = playlists))
        })
    })

    after(() => {
        cy.getAccessToken(false).then(accessToken => {
            cy.unfollowPlaylists(this.playlists, accessToken)
        })
    })

    it('Check Make Playlists Public/Private, Collaborative/NonCollaborative Functionality', () => {

        // Step 1
        cy.get('#navbar-items-playlists').should('be.visible').click()

        // Step 2
        cy.fixture('playlists1.json').then(fixture => fixture.playlists.forEach(playlist => {
            cy.contains('.playlist-container', playlist.name)
                .should('be.visible')
                .click()
                .should('have.class', 'playlist-container-is-selected')
        }))

        // Step 3
        cy.get('#button-collaboration').should('be.visible').click()
        cy.get('.modal-dialog').should('be.visible')
        cy.get('.modal-body').should('have.text', 'Are you sure you want to change the status of these playlists?')

        // Step 4
        cy.contains('button', 'Cancel').should('be.visible').click()
        cy.get('.modal-dialog').should('not.exist')
        cy.getAccessToken(false).then(accessToken => {
            cy.getPlaylists(accessToken).then(playlists => {
                playlists.filter(playlist => this.playlists.includes(playlist.id)).forEach(playlist => {
                    expect(playlist.public).to.be.true
                    expect(playlist.collaborative).to.be.false
                })
            })
        })

        // Step 5
        cy.fixture('playlists1.json').then(fixture => fixture.playlists.forEach(playlist => {
            cy.contains('.playlist-container', playlist.name)
                .should('have.class', 'playlist-container-is-selected')
        }))
        cy.get('#button-collaboration').should('be.visible').click()
        cy.get('.modal-dialog').should('be.visible')

        // Step 6
        cy.contains('button', 'Change Collaboration').should('be.visible').click()
        cy.get('.modal-dialog').should('be.visible')
        cy.fixture('playlists1.json').then(fixture => {
            cy.get('.modal-body').should('contain.text',
                'The following playlists can not be edited because they can\'t ' +
                'be both public and collaborative: ')
            fixture.playlists.map(playlist => playlist.name).forEach(name => {
                cy.get('.modal-body').should('contain.text', name)
            })
        })

        // Step 7
        cy.contains('button', 'OK').should('be.visible').click()
        cy.get('.modal-dialog').should('not.exist')

        // Step 8
        cy.get('#button-visibility').should('be.visible').click()
        cy.get('.modal-dialog').should('be.visible')
        cy.get('.modal-body').should('have.text', 'Are you sure you want to change the status of these playlists?')

        // Step 9
        cy.contains('button', 'Change Visibility').should('be.visible').click()
        cy.get('.modal-dialog').should('be.visible')
        cy.fixture('playlists1.json').then(fixture => {
            cy.get('.modal-body').should('contain.text', 'Successfully edited the following playlists: ')
            fixture.playlists.map(playlist => playlist.name).forEach(name => {
                cy.get('.modal-body').should('contain.text', name)
            })
        })

        // Step 10
        cy.contains('button', 'OK').should('be.visible').click()
        cy.get('.modal-dialog').should('not.exist')
        cy.getAccessToken(false).then(accessToken => {
            cy.getPlaylists(accessToken).then(playlists => {
                playlists.filter(playlist => this.playlists.includes(playlist.id)).forEach(playlist => {
                    expect(playlist.public).to.be.false
                    expect(playlist.collaborative).to.be.false
                })
            })
        })

        // Step 11
        cy.fixture('playlists1.json').then(fixture => fixture.playlists.forEach(playlist => {
            cy.contains('.playlist-container', playlist.name)
                .should('have.class', 'playlist-container-is-selected')
        }))
        cy.get('#button-collaboration').should('be.visible').click()
        cy.get('.modal-dialog').should('be.visible')

        // Step 12
        cy.contains('button', 'Change Collaboration').should('be.visible').click()
        cy.get('.modal-dialog').should('be.visible')
        cy.fixture('playlists1.json').then(fixture => {
            cy.get('.modal-body').should('contain.text', 'Successfully edited the following playlists: ')
            fixture.playlists.map(playlist => playlist.name).forEach(name => {
                cy.get('.modal-body').should('contain.text', name)
            })
        })

        // Step 13
        cy.contains('button', 'OK').should('be.visible').click()
        cy.get('.modal-dialog').should('not.exist')
        cy.getAccessToken(false).then(accessToken => {
            cy.getPlaylists(accessToken).then(playlists => {
                playlists.filter(playlist => this.playlists.includes(playlist.id)).forEach(playlist => {
                    expect(playlist.public).to.be.false
                    expect(playlist.collaborative).to.be.true
                })
            })
        })
    })
})