import getAccessToken from "./commands/get_access_token_command";
import saveTracks from "./commands/save_tracks_command"
import createPlaylists from "./commands/create_playlists_command";
import removeTracks from "./commands/remove_tracks_command";
import unfollowPlaylists from "./commands/unfollow_playlists_command";
import checkPlaylistsHaveTracks from "./commands/check_playlists_have_tracks";
import checkLikedTracks from "./commands/check_liked_tracks_command";
import addTracksToPlaylists from "./commands/add_tracks_to_playlists";
import removeTracksFromPlaylists from "./commands/remove_tracks_from_playlists";

Cypress.Commands.add('getAccessToken', getAccessToken)
Cypress.Commands.add('saveTracks', saveTracks)
Cypress.Commands.add('removeTracks', removeTracks)
Cypress.Commands.add('createPlaylists', createPlaylists)
Cypress.Commands.add('unfollowPlaylists', unfollowPlaylists)
Cypress.Commands.add('checkPlaylistsHaveTracks', checkPlaylistsHaveTracks)
Cypress.Commands.add('checkLikedTracks', checkLikedTracks)
Cypress.Commands.add('addTracksToPlaylists', addTracksToPlaylists)
Cypress.Commands.add('removeTracksFromPlaylists', removeTracksFromPlaylists)