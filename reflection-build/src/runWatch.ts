#!/usr/bin/env node

import * as path from 'path';
import { cmd } from '@proteinjs/util-node';

// Determine the paths to gulp and the src/watch.ts
const gulpPath = path.resolve(__dirname, '../../node_modules/.bin/gulp');
const gulpfilePath = path.resolve(__dirname, './watch.js');

// Run the Gulp script
cmd(gulpPath, ['--gulpfile', gulpfilePath, '--cwd', process.cwd()]);
