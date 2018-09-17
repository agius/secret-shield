'use strict';

const tape = require('tape');

const Shield = require('../../../lib/shield');
const NpmPlugin = require('../../../lib/plugins/npm');

const fakeToken = '1234abcd-5678-cdef-ab12-cd34ff567890';

tape('[npm-plugin] npm token', (t) => {
  const shield = new Shield();
  const npm = new NpmPlugin();
  shield.addPlugin(npm);

  const findings = shield.processString(fakeToken);

  t.equal(findings.length, 1, '[npm-plugin] found a token');
  t.ok(/NPM Token/.test('' + findings[0]), '[npm-plugin] is an NPM Token');
  t.end();
});

tape('[npm-plugin] npmrc token', (t) => {
  const shield = new Shield();
  const npm = new NpmPlugin({ minEntropy: 999 }); // skip the non-npmrc check
  shield.addPlugin(npm);

  const findings = shield.processString('//registry.npmjs.org/:_authToken=' + fakeToken);

  t.equal(findings.length, 1, '[npm-plugin] found a token');
  t.ok(/\.npmrc Token/.test('' + findings[0]), '[npm-plugin] is a .npmrc Token');
  t.end();
});

tape('[npm-plugin] ignores non-matching string', (t) => {
  const shield = new Shield();
  const npm = new NpmPlugin({ minEntropy: 999 }); // skip the non-npmrc check
  shield.addPlugin(npm);

  const findings = shield.processString('abcdefg');

  t.equal(findings.length, 0, '[npm-plugin] no problemo');
  t.end();
});

