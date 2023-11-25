#!/bin/sh

#[ ! -d "./node_modules/" ] && bun i
screen -dmS image bun --watch image.js
