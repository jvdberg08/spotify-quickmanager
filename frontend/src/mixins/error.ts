import {AxiosError} from "axios";
import Vue from "vue";

export default class AxiosErrorHandler extends Vue {

    handleAxiosError(error: AxiosError) {
        let status = 'undefined'
        if (error.response !== undefined) {
            status = error.response.status.toString()
        }
        this.$bvModal.msgBoxOk('An error has occurred! Please try logging in and out again!', {
            title: 'Error ' + status,
            headerTextVariant: 'danger',
            bodyTextVariant: 'danger',
            okVariant: 'danger'
        }).then(() => {
            this.$store.commit('setIsLoading', false)
        })
    }
}