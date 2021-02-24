export default function createPlaylists(fixturePath: string, accessToken: string, callback?: (playlists: string[]) => any) {
    cy.fixture(fixturePath).then(fixture => {
        const headers = {
            'Authorization': 'Bearer ' + accessToken,
            'Content-Type': 'application/json'
        }

        const playlists = []
        fixture.playlists.forEach(async playlist => {
            const data = {
                name: playlist.name,
                public: playlist.public,
                collaborative: playlist.collaborative,
                description: playlist.description
            }
            cy.request({
                url: Cypress.env('spotify_api_url') + '/users/' + playlist.user + '/playlists',
                method: 'POST',
                body: data,
                headers: headers
            }).then(response => {
                playlists.push(response.body.id)
            })
        })
        callback(playlists)
    })
}