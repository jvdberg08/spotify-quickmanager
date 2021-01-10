# Spotify QuickManager
I started this project to teach myself more about web development, about Django and Vue.js in particular.
This is a tool that allows you to view all information about your Spotify library (such as Liked Songs, Playlists, 
Artists, Albums). It's not very useful for anything, but it's mostly for my practice! :)


## Installation

First you will need to create your own Spotify API application on
https://developer.spotify.com/dashboard/applications and put the `CLIENT ID` and `CLIENT Secret` in
`backend/spotifyauth/views.py`.

Next, you need to generate a random django `SECRET_KEY` with the method
`django.core.management.utils.get_random_secret_key()` and put it in `backend/spotifyquickmanager/settings.py`.

### Docker

`git clone https://github.com/jvdberg08/spotify-quickmanager.git
&& cd spotify-quickmanager && docker-compose up`


### Manual

`git clone https://github.com/jvdberg08/spotify-quickmanager.git && cd spotify-quickmanager/backend
&& source ../venv/bin/activate && pip install -r requirements.txt && python manage.py runserver`

And in another terminal: `cd spotify-quickmanager/frontend && npm install && npm run serve`