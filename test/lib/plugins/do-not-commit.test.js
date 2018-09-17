'use strict';

const tape = require('tape');

const Shield = require('../../../lib/shield');
const DNCPlugin = require('../../../lib/plugins/do-not-commit');

tape('[dnc-plugin] exact match', (t) => {
  const shield = new Shield();
  const dnc = new DNCPlugin();
  shield.addPlugin(dnc);

  const findings = shield.processString('dnc DO NOT COMMIT OMG');

  t.equal(findings.length, 1, '[dnc-plugin] found exact match');
  t.ok(/Do Not Commit/.test('' + findings[0]), '[dnc-plugin] is a dnc message');
  t.end();
});

tape('[dnc-plugin] fuzzy match message', (t) => {
  const shield = new Shield();
  const dnc = new DNCPlugin();
  shield.addPlugin(dnc);

  const findings = shield.processString('dnc DO NT COMMIT OMG');

  t.equal(findings.length, 1, '[dnc-plugin] found fuzzy match');
  t.ok(/Do Not Commit/.test('' + findings[0]), '[dnc-plugin] is a dnc message');
  t.end();
});

tape('[dnc-plugin] ignores non-matching string', (t) => {
  const shield = new Shield();
  const dnc = new DNCPlugin();
  shield.addPlugin(dnc);

  const findings = shield.processString('this should not match');

  t.equal(findings.length, 0, '[dnc-plugin] found nothing');
  t.end();
});

tape('[dnc-plugin] custom threshold setting', (t) => {
  const shield = new Shield();
  const dnc = new DNCPlugin({ threshold: 0.1 });
  shield.addPlugin(dnc);

  const findings = shield.processString('threshold so small anything should match');

  t.equal(findings.length, 1, '[dnc-plugin] found fuzzy match');
  t.ok(/Do Not Commit/.test('' + findings[0]), '[dnc-plugin] is a dnc message');
  t.end();
});
