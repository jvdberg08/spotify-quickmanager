# Spotify QuickManager
I started this project to teach myself more about web development, about Django and Vue.js in particular.
This is a tool that allows you to view all information about your Spotify library (such as Liked Songs, Playlists, 
Artists, Albums) and modify the data. You can for instance modify multiple songs and playlists at once, which you can't
easily do in the Spotify client. Other than that it's not very useful for anything, but it's mostly for my practice! :)


## Installation

1. Run `git clone https://github.com/jvdberg08/spotify-quickmanager.git && cp ./spotify-quickmanager/backend/.env.example ./spotify-quickmanager/backend/.env && cd ./spotify-quickmanager`
2. You will need to create your own Spotify API application on https://developer.spotify.com/dashboard/applications. Take the `CLIENT_ID` and `CLIENT_SECRET` and put them in `./backend/.env`
3. Next, you need to generate a random django `SECRET_KEY` and put it in `./backend/.env`
4. Create a virtual environment and install dependencies (ex. `virtualenv ./backend/venv`, automatically installs packages from `./backend/requirements.txt`)
5a. Run `docker-compose up` for a dev environment or `docker-compose -f docker-compose.prod.yml up` for a production environment
5b. If you don't have Docker, you can create a postgres database yourself and run `python ./backend/manage.py runserver` and `cd ./frontend/ && npm run serve -- --port 80`

## Running tests

1. Run steps above
2. Run `cp ./test/cypress.env.example.json ./test/cypress.env.json`
3. Put Spotify `CLIENT_ID` in `./test/cypress.env.json`
4. Get a Spotify refresh token for your account: [Spotify API Reference](https://developer.spotify.com/documentation/general/guides/authorization-guide/#authorization-code-flow)
5. Put this refresh token in `./backend/.env`
6. Run `cd ./test/ && npm run runner`
7. Run the tests you want with the Cypress Test Suite
