#!/usr/bin/env node
'use strict';

const path = require('path');


const CLI = require(path.resolve(__dirname, '..', 'lib', 'cli'));
CLI.program.parse(process.argv);
