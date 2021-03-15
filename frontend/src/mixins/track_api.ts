import {Track as ITrack} from "@/mixins/interfaces"
import {AxiosResponse} from "axios";
import Component from "vue-class-component";
import AxiosErrorHandler from "@/mixins/error";

interface LikedSongsResponse {
    total: number;
    items: Array<{ track: ITrack }>;
}

@Component
export default class TrackAPI extends AxiosErrorHandler {

    getSongsData(): Promise<ITrack[]> {
        this.$store.commit('setIsLoading', true)
        return this.$axios.get(process.env.VUE_APP_BACKEND_API + "/liked_songs")
            .then((response: AxiosResponse<LikedSongsResponse>) => {
                this.$store.commit('setIsLoading', false)
                return response.data.items.map(item => item.track)
            }).catch(error => {
                this.handleAxiosError(error)
                return []
            })
    }

    addSongsData(tracks: ITrack[], notification = true): Promise<boolean> {
        this.$store.commit('setIsLoading', true)
        return this.$axios.put(process.env.VUE_APP_BACKEND_API + '/liked_songs', {
            tracks: tracks.map(track => track.id).join()
        }).then(() => {
            this.$store.commit('setIsLoading', false)
            if (notification) {
                this.$bvModal.msgBoxOk('Successfully added songs to Liked Songs!', {
                    title: 'Success', okVariant: 'success'
                }).then()
            }
            return true
        }).catch(error => {
            this.handleAxiosError(error)
            return false
        })
    }

    async removeSongsData(tracks: ITrack[], confirm = true, notification = true): Promise<boolean> {
        if (confirm) {
            const isConfirmed = await this.$bvModal.msgBoxConfirm(
                'Are you sure you want to remove all selected songs from your Liked Songs?',
                {title: 'Please Confirm', okVariant: 'danger', okTitle: 'Delete', cancelTitle: 'Cancel'})
            if (!isConfirmed) return false
        }

        this.$store.commit('setIsLoading', true)
        return this.$axios.delete(process.env.VUE_APP_BACKEND_API + "/liked_songs", {
            params: {tracks: tracks.map(track => track.id).join()}
        }).then(() => {
            this.$store.commit('setIsLoading', false)
            if (notification) {
                this.$bvModal.msgBoxOk('Successfully removed songs from Liked Songs!', {
                    title: 'Success', okVariant: 'success'
                })
            }
            return true
        }).catch((error => {
            this.handleAxiosError(error)
            return false
        }))
    }
}