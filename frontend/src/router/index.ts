import Vue from 'vue'
import VueRouter from 'vue-router'

import TabSongs from "@/views/TabSongs.vue";
import TabPlaylists from "@/views/TabPlaylists.vue";
import TabAlbums from "@/views/TabAlbums.vue";
import TabArtists from "@/views/TabArtists.vue";

import store from "@/store";

Vue.use(VueRouter)

const routes = [

    {
        path: '/songs',
        name: 'songs',
        component: TabSongs
    },
    {
        path: '/playlists',
        component: TabPlaylists
    },
    {
        path: '/albums',
        component: TabAlbums
    },
    {
        path: '/artists',
        component: TabArtists
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