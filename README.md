# Starboard

A github stared repo management app

## Tech Stack

- Database
    - Postgres 9.5 (primary datastore)
    - Redis 3.0 (session store)
- Server
    - Node.js
    - Koa (http server)
    - React (server rendering)
- Browser
    - React
    - React Router
    - Redux
- Support
    - Docker
    - Webpack
    - Babel
    - Eslint

## Development Setup

### Docker

You will need Docker to run databases. You can get Docker in your machine anyway you want if you know what you are doing. If not, the most recommended way to get Docker is through homebrew (assuming you are using OS X, sorry Windows folks).

```sh
# Run in a shell
brew update
brew install docker-machine docker-compose
docker-machine create -d virtualbox starboard-dev
```

After installation of Docker tools, each time you want to work on this project, you have to running following steps to bring Docker server online:

```sh
docker-machine start starboard-dev
eval $(docker-machine env starboard-dev)
```

### Node.js

The backend of this application is entirely based on JavaScript. The server is in Node.js. Currently it works on

- node v5.5.0
- npm v3.5.3

Don't forget to run `npm install` to install all the dependencies.

### Environment Variables

Make sure you have `./node_modules/.bin` in your `$PATH` so you can use local installed executables.

### Configuration Files

You will need to create a `config/local-development.js` that looks like:

```js
'use strict';

module.exports = {
  github: {
    clientID: '<GITHUB_CLIENT_ID>',
    clientSecret: '<GITHUB_CLIENT_SECRET>',
  }
};
```

You will have to go to https://github.com/settings/developers to create a developer application and put the client ID and client secret here.

### Database Schema

Run following commands to migrate database to latest schema

```sh
# In shell
knex migrate:latest
```

### Start Hacking

If you successfully reached here without any problem. Congratulation you might have completed a complicated dev setup. But I assure you those will never get in your way again. The last thing you need to run to start the dev server is:

```sh
# In shell
npm run dev
```

_It might take a little longer to run for the first time, due to Docker has to pull down all the images for the first time._
