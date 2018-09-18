#!/usr/bin/env node
'use strict';

const path = require('path');


const CLI = require(path.resolve(__dirname, '..', 'lib', 'cli'));

const cli = new CLI(process.argv);
cli.run();
