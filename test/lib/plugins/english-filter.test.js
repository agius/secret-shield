'use strict';

const tape = require('tape');

const Shield = require('../../../lib/shield');
const Finding = require('../../../lib/finding');
const EnglishFilter = require('../../../lib/plugins/english-filter');

const finder = {
  processString: function(input) {
    const match = input.match(/(quadruplications)/i);
    if(match) return new Finding({
      ruleName: 'High-entropy word matched!',
      match: match
    });
  }
};

tape('[english-filter] filters out english words', (t) => {
  const shield = new Shield();
  shield.addPlugin(EnglishFilter);
  shield.addPlugin(finder);

  const filtered = shield.preprocessString('Quadruplications photodecomposition aerobiologically animadversiveness');
  const findings = shield.processString(filtered);

  t.equal(findings.length, 0, '[english-filter] removed high-entropy english words');
  t.end();
});

tape('[english-filter] ignores non-words', (t) => {
  const shield = new Shield();
  shield.addPlugin(EnglishFilter);
  shield.addPlugin(finder);

  const input = 'lhjsdb897623kbjab no one has disproven timecube ::9870sbh';
  const filtered = shield.preprocessString(input);
  t.equal(filtered, input, '[english-filter] ignores non-high-entropy-english-word strings');
  t.end();
});
