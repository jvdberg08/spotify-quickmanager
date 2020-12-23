import Vue from 'vue'
import VueRouter from 'vue-router'

import SongsTab from "@/views/SongsTab";
import PlaylistsTab from "@/views/PlaylistsTab";
import AlbumsTab from "@/views/AlbumsTab";
import ArtistsTab from "@/views/ArtistsTab";

Vue.use(VueRouter)

const routes = [

    {
        path: '/songs',
        name: 'songs',
        component: SongsTab
    },
    {
        path: '/playlists',
        name: 'playlists',
        component: PlaylistsTab
    },
    {
        path: '/albums',
        name: 'albums',
        component: AlbumsTab
    },
    {
        path: '/artists',
        name: 'artists',
        component: ArtistsTab
    },
    {
        path: '',
        name: 'NotFoundRedirect',
        redirect: {name: 'songs'}
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
});

export default router