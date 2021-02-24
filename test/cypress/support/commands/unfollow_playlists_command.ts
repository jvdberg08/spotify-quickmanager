export default function unfollowPlaylists(playlists: string[], accessToken: string) {
    const headers = {
        'Authorization': 'Bearer ' + accessToken,
        'Content-Type': 'application/json'
    }

    playlists.forEach(async playlistId => {
        cy.request({
            url: Cypress.env('spotify_api_url') + '/playlists/' + playlistId + '/followers',
            method: 'DELETE',
            headers: headers
        })
    })
}