#!/bin/sh

#[ ! -d "./node_modules/" ] && bun i
bun image.js $1
