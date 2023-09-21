#!/bin/bash

set -e

cd "$(dirname "$0")"

env=$1

# TODO: pass env to this script based on circle branch
# TODO: check if $env defined and correct

# Do not use the override compose file, which is intended for development
# We run in prod mode, but we still build from this guild repository
docker-compose -f ../docker-compose.yml -f "../docker-compose.${env}.yml" up --build -d --force-recreate

# Clean up dangling images
docker image prune -f

