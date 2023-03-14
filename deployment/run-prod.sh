#!/bin/bash

usage() { 
	echo "Usage: $0 [-u]";
	echo "          "
	echo "  options:"
	echo "    -u       Update to latest main branch using git"
	exit 1; 
}

cd "$(dirname "$0")"

UPDATE=false

while getopts "u" o; do
    case "${o}" in
        u)
            UPDATE=true
	    ;;
        *)
            usage
            ;;
    esac
done

if [ $UPDATE == "true" ]; then
  echo "Updating to latest main branch"
  git reset --hard origin/main
  git pull origin main
fi

docker-compose -f ../docker-compose.yml up --build -d --force-recreate 

