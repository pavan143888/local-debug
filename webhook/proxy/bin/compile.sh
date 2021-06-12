#!/bin/bash
npm install
npm run tsc
cp -R ./node_modules ./dist
