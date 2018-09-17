'use strict';

const tape = require('tape');

const Shield = require('../../../lib/shield');
const Finding = require('../../../lib/finding');
const LSF = require('../../../lib/plugins/long-string-filter');

const longlong = Buffer.alloc(2001, 'a').toString();
const longFinder = {
  processString: function(input) {
    if(input.length > 0) return new Finding({
      ruleName: 'Input Too Long',
      match: input
    });
  }
};

tape('[long-string-filter] filters out long strings', (t) => {
  const shield = new Shield();
  shield.addPlugin(LSF);
  shield.addPlugin(longFinder);

  const filtered = shield.preprocessString(longlong);
  const findings = shield.processString(filtered);

  t.equal(findings.length, 0, '[long-string-filter] removed long string');
  t.end();
});

tape.skip('[long-string-filter] filters out long strings with spaces', (t) => {
  const shield = new Shield();
  shield.addPlugin(LSF);
  shield.addPlugin(longFinder);

  const filtered = shield.preprocessString(longlong + ' ' + longlong);
  const findings = shield.processString(filtered);

  t.equal(findings.length, 0, '[long-string-filter] removed long string');
  t.end();
});

tape('[long-string-filter] ignores short strings', (t) => {
  const shield = new Shield();
  shield.addPlugin(LSF);
  shield.addPlugin(longFinder);

  const filtered = shield.preprocessString('this string is pretty short');
  const findings = shield.processString(filtered);

  t.equal(findings.length, 1, '[long-string-filter] found non-zero-len-str');
  t.end();
});
