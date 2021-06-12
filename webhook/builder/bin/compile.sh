#!/bin/bash
npm install
npm run tsc
cp -R ./node_modules ./dist
zip --quiet -r dist.zip dist/
rm -rf dist
