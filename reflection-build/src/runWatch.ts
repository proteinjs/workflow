#!/usr/bin/env node

import { spawn } from 'child_process';
import * as path from 'path';

// Determine the paths to gulp and the src/watch.ts
const gulpPath = path.resolve(__dirname, '../../node_modules/.bin/gulp');
const gulpfilePath = path.resolve(__dirname, './watch.js');

// Run the Gulp script
const gulpProcess = spawn(gulpPath, ['--gulpfile', gulpfilePath, '--cwd', process.cwd()], { stdio: 'inherit' });

gulpProcess.on('error', (error: Error) => {
    console.error('Failed to start subprocess:', error);
});
