import Vue from 'vue'
import VueRouter from 'vue-router'

import SongsTab from "@/views/SongsTab.vue";
import PlaylistsTab from "@/views/PlaylistsTab.vue";
import AlbumsTab from "@/views/AlbumsTab.vue";
import ArtistsTab from "@/views/ArtistsTab.vue";

import store from "@/store";

Vue.use(VueRouter)

const routes = [

    {
        path: '/songs',
        name: 'songs',
        component: SongsTab
    },
    {
        path: '/playlists',
        component: PlaylistsTab
    },
    {
        path: '/albums',
        component: AlbumsTab
    },
    {
        path: '/artists',
        component: ArtistsTab
    },
    {
        path: '',
        redirect: {name: 'songs'}
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
});

router.afterEach((to) => {
    if ('authExpiry' in to.query) {
        store.commit('setAuthorization', to.query.authExpiry)
        router.push(to.path).then()
    }
})

export default router