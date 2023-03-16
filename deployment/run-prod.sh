#!/bin/bash

# Do not use the override compose file, which is intended for development
# We run in prod mode, but we still build from this guild repository
docker-compose -f ../docker-compose.yml up --build -d --force-recreate 

