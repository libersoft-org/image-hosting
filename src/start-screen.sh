#!/bin/sh

#[ ! -d "./node_modules/" ] && bun i
screen -dmS image bash -c '
while true; do
 bun image.js || exit 1
done
'
