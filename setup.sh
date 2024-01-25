#!/bin/bash

cd util/common
npm i
npm run build
cd ../server
npm i
npm run build
cd ../../build
npm i
npm run build
npm run build-repo