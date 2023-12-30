#!/bin/sh

show_help() {
  echo """
  Commands
  ---------------------------------------------------------------

  dev                : Run express.js server using nodemon
  prod               : Run express.js server using node

  """
}

case "$1" in
  "dev" )
    yarn dev
  ;;
  "prod" )
    yarn prod
  ;;
  * )
    show_help
  ;;
esac
