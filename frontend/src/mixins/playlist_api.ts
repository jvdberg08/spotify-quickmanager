import Vue from "vue";
import {Playlist as IPlaylist, Track as ITrack} from "@/mixins/interfaces"
import {AxiosError, AxiosResponse} from "axios";
import Component from "vue-class-component";

interface PlaylistsResponse {
    total: number;
    items: IPlaylist[];
}

interface PlaylistTracksResponse {
    total: number;
    items: Array<{ track: ITrack }>;
}

export enum EditPlaylistType {
    Visibility = 'Change Visibility',
    Collaboration = 'Change Collaboration'
}

@Component
export default class PlaylistAPI extends Vue {

    getPlaylistsData(): Promise<IPlaylist[]> {
        this.$store.commit('setIsLoading', true)
        return this.$axios.get(process.env.VUE_APP_BACKEND_API + "/playlists")
            .then((response: AxiosResponse<PlaylistsResponse>) => {
                this.$store.commit('setIsLoading', false)
                return response.data.items
            }).catch(error => {
                this.$store.commit('setIsLoading', false)
                console.log(error)
                return []
            })
    }

    getPlaylistTracksData(playlist: IPlaylist): Promise<ITrack[]> {
        this.$store.commit('setIsLoading', true)
        return this.$axios.get(process.env.VUE_APP_BACKEND_API + "/playlist/tracks", {
            params: {playlist: playlist.id}
        }).then((response: AxiosResponse<PlaylistTracksResponse>) => {
            this.$store.commit('setIsLoading', false)
            return response.data.items.map(item => item.track)
        }).catch(error => {
            this.$store.commit('setIsLoading', false)
            console.log(error)
            return []
        })
    }

    async unfollowPlaylistsData(playlists: IPlaylist[], confirm = true, notification = true): Promise<boolean> {
        if (confirm) {
            const isConfirmed = this.$bvModal.msgBoxConfirm('Are you sure you want to unfollow all selected playlists?',
                {title: 'Please Confirm', okVariant: 'danger', okTitle: 'Unfollow', cancelTitle: 'Cancel'})
            if (!isConfirmed) return false
        }

        this.$store.commit('setIsLoading', true)
        return this.$axios.delete(process.env.VUE_APP_BACKEND_API + "/playlists", {
            params: {playlists: playlists.map(playlist => playlist.id).join()}
        }).then(() => {
            this.$store.commit('setIsLoading', false)
            if (notification) {
                this.$bvModal.msgBoxOk('Successfully unfollowed these playlists!',
                    {title: 'Success', okVariant: 'success'})
            }
            return true
        }).catch(error => {
            this.$store.commit('setIsLoading', false)
            console.log(error)
            return false
        })
    }

    async removePlaylistTracksData(playlist: IPlaylist, tracks: ITrack[], confirm = true, notification = true): Promise<boolean> {
        if (confirm) {
            const isConfirmed = await this.$bvModal.msgBoxConfirm('Are you sure you want to remove all selected songs from this playlist?',
                {title: 'Please Confirm', okVariant: 'danger', okTitle: 'Delete', cancelTitle: 'Cancel'})
            if (!isConfirmed) return false
        }

        this.$store.commit('setIsLoading', true)
        return this.$axios.delete(process.env.VUE_APP_BACKEND_API + "/playlist/tracks", {
            params: {
                playlist: playlist.id,
                tracks: tracks.map(track => track.id).join()
            }
        }).then(() => {
            this.$store.commit('setIsLoading', false)
            if (notification) {
                this.$bvModal.msgBoxOk('Successfully removed songs from playlist!',
                    {title: 'Success', okVariant: 'success'})
            }
            return true
        }).catch(error => {
            this.$store.commit('setIsLoading', false)
            console.log(error)
            return false
        })
    }

    async addPlaylistsTracksData(playlists: IPlaylist[], tracks: ITrack[], notification = true): Promise<boolean> {
        this.$store.commit('setIsLoading', true)
        return this.$axios.post(process.env.VUE_APP_BACKEND_API + "/playlists/tracks",
            {tracks: tracks.map(track => track.id).join()},
            {params: {playlists: playlists.map(playlist => playlist.id).join()}}
        ).then(() => {
            this.$store.commit('setIsLoading', false)
            if (notification) {
                this.$bvModal.msgBoxOk('Successfully added songs to the playlists!', {
                    title: 'Success', okVariant: 'success'
                })
            }
            return true
        }).catch(error => {
            this.$store.commit('setIsLoading', false)
            console.log(error)
            return false
        })
    }

    async editPlaylistData(playlist: IPlaylist, notification = true): Promise<boolean> {
        this.$store.commit('setIsLoading', true)
        return this.$axios.put(process.env.VUE_APP_BACKEND_API + "/playlists", {
            playlists: [playlist]
        }).then(() => {
            this.$store.commit('setIsLoading', false)
            if (notification) {
                this.$bvModal.msgBoxOk('Successfully edited playlist!',
                    {title: 'Success', okVariant: 'success'})
            }
            return true
        }).catch(error => {
            this.$store.commit('setIsLoading', false)
            console.log(error)
            return false
        })
    }

    async changePlaylistsStatusData(playlists: IPlaylist[], type: EditPlaylistType, confirm = true, notification = true): Promise<boolean> {
        if (confirm) {
            const isConfirmed = await this.$bvModal.msgBoxConfirm('Are you sure you want to change the status of these playlists?',
                {title: 'Please Confirm', okVariant: 'danger', okTitle: type, cancelTitle: 'Cancel'})
            if (!isConfirmed) return false
        }

        const data = this.checkInvalidPlaylists(playlists, type)
        if (data.errorMessage !== undefined) {
            await this.$bvModal.msgBoxOk(data.errorMessage, {title: 'Error', okVariant: 'danger'})
        }
        if (!data.validPlaylists.length) return false
        this.$store.commit('setIsLoading', true)
        return this.$axios.put(process.env.VUE_APP_BACKEND_API + "/playlists", {
            playlists: data.validPlaylists.map(playlist => {
                if (type === EditPlaylistType.Visibility) playlist.public = !playlist.public
                if (type === EditPlaylistType.Collaboration) playlist.collaborative = !playlist.collaborative
                return playlist
            })
        }).then(() => {
            this.$store.commit('setIsLoading', false)
            if (notification) {
                this.$bvModal.msgBoxOk('Successfully edited the following playlists: ' +
                    data.validPlaylists.map(playlist => playlist.name).join() + '!', {
                    title: 'Success', okVariant: 'success'
                })
            }
            return true
        }).catch((error: AxiosError) => {
            this.$store.commit('setIsLoading', false)
            console.log(error)
            return false
        })
    }

    private checkInvalidPlaylists(playlists: IPlaylist[], type: EditPlaylistType): { validPlaylists: IPlaylist[]; errorMessage?: string } {
        const invalidPlaylists: IPlaylist[] = []
        const validPlaylists = playlists.filter((playlist: IPlaylist) => {
            if (playlist.public && type === EditPlaylistType.Collaboration
                || playlist.collaborative && type == EditPlaylistType.Visibility) {
                invalidPlaylists.push(playlist)
                return false
            }
            return true
        })

        if (invalidPlaylists.length) {
            const errorMessage = 'The following playlists can not be edited because they can\'t be both public and collaborative: ' +
                invalidPlaylists.map(playlist => playlist.name).join(', ')
            return {validPlaylists, errorMessage}
        }
        return {validPlaylists}
    }
}