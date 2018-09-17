'use strict';

const path = require('path');

const tape = require('tape');

const Shield = require('../lib/shield');

const finder = {
  preprocessString: (str) => { return str.replace(/timecube/, 'tim3cube'); },
  processString: (str) => {
    if(str.match(/gene ray/)) return new Shield.Finding({
      ruleName: 'gene ray', match: str
    });
  },
  fileFilter: (str) => {
    return /cannot-be/.test(str);
  }
};

tape('[Shield] initializes', (t) => {
  const shield = new Shield();
  t.equal(shield.plugins.length, 0, '[Shield] has no plugins on init');
  t.ok(shield.config, '[Shield] config defaults to {}');
  t.end();
});

tape('[Shield] can preprocessString', (t) => {
  const shield = new Shield();
  const str = 'preprocess does nothing by default';
  const processed = shield.preprocessString(str);
  t.equal(processed, str, '[Shield] preprocessString does nothing by default');
  t.end();
});

tape('[Shield] can processString', (t) => {
  const shield = new Shield();
  const str = 'processString does nothing by default';
  const findings = shield.processString(str);
  t.equal(findings.length, 0, '[Shield] processString finds nothing by default');
  t.end();
});

tape('[Shield] reads files', (t) => {
  const shield = new Shield();
  shield.addPlugin(finder);

  const exFile = path.resolve(__dirname, 'assets', 'example-file.txt');
  shield.processFile(exFile).then((findings) => {
    t.equal(findings.length, 1, '[Shield] Found one problem in file');
    t.ok(/gene ray/.test(findings[0].toString()), '[Shield] found gene');
    t.end();
  });
});

tape('[Shield] reads directories', (t) => {
  const shield = new Shield();
  shield.addPlugin(finder);

  const assetDir = path.resolve(__dirname, 'assets');
  shield.processDirectory(assetDir).then((findings) => {
    t.equal(findings.length, 2, '[Shield] Found one problem in dir');
    t.ok(/gene ray/.test(findings[0].toString()), 'Shield found gene');
    t.ok(/gene ray/.test(findings[1].toString()), 'Shield found gene in nested dir');
    t.end();
  });
});
