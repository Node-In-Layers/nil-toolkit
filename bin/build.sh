#!/bin/bash
set -e

rm -Rf ./dist
tsc -p ./tsconfig.json
cp package.json ./dist
cp README.md ./dist
cp -R ./src/templates ./dist
cp -R ./bin/ ./dist/
rm ./dist/bin/build.sh

sed -i -e 's/..\/dist\//..\//g' ./dist/bin/nil-toolkit.js
