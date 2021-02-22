import Vue from "vue";
import {Track as ITrack} from "@/mixins/interfaces"
import {AxiosResponse} from "axios";
import Component from "vue-class-component";

interface LikedSongsResponse {
    total: number;
    items: Array<{ track: ITrack }>;
}

@Component
export default class TrackAPI extends Vue {

    getSongsData(): Promise<ITrack[]> {
        this.$store.commit('setIsLoading', true)
        return this.$axios.get(process.env.VUE_APP_BACKEND_API + "/liked_songs")
            .then((response: AxiosResponse<LikedSongsResponse>) => {
                this.$store.commit('setIsLoading', false)
                return response.data.items.map(item => item.track)
            }).catch(error => {
                this.$store.commit('setIsLoading', false)
                console.log(error)
                return []
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
        }).catch(error => {
            this.$store.commit('setIsLoading', false)
            console.log(error)
            return false
        })
    }
}