import login from "./commands/login_command"
import saveTracks from "./commands/save_tracks_command"
import getSpotifyAuthorization from "./commands/get_spotify_authorization_command";
import createPlaylists from "./commands/create_playlists_command";
import removeTracks from "./commands/remove_tracks_command";
import unfollowPlaylists from "./commands/unfollow_playlists_command";
import checkPlaylistsHaveTracks from "./commands/check_playlists_have_tracks";

Cypress.Commands.add('login', login)
Cypress.Commands.add('getSpotifyAuthorization', getSpotifyAuthorization)
Cypress.Commands.add('saveTracks', saveTracks)
Cypress.Commands.add('removeTracks', removeTracks)
Cypress.Commands.add('createPlaylists', createPlaylists)
Cypress.Commands.add('unfollowPlaylists', unfollowPlaylists)
Cypress.Commands.add('checkPlaylistsHaveTracks', checkPlaylistsHaveTracks)