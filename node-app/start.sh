#!/bin/bash

source app.env

cp -r /nodecache/node_modules/. /application/node_modules/

if [ $ENV = 'production' ]; then
    npm run build:production && npm run start:server
elif [ $ENV = 'development' ]; then
    npm run build:development && npm run start:server
else
    npm run build:development && npm run start
fi
