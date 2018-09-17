'use strict';

const tape = require('tape');

const Shield = require('../../../lib/shield');
const Finding = require('../../../lib/finding');
const CodeWordsFilter = require('../../../lib/plugins/code-words-filter');

const finder = {
  processString: function(input) {
    const match = input.match(/(MainIdReadCapacity)/i);
    if(match) return new Finding({
      ruleName: 'High-entropy code word matched!',
      match: match
    });
  }
};

tape('[code-words-filter] filters out code words', (t) => {
  const shield = new Shield();
  shield.addPlugin(CodeWordsFilter);
  shield.addPlugin(finder);

  const filtered = shield.preprocessString('MainIdReadCapacity githubAccessToken FailedRecordCount AbstractInterruptibleBatchPreparedStatementSetter');
  const findings = shield.processString(filtered);

  t.equal(findings.length, 0, '[code-words-filter] removed high-entropy code words');
  t.end();
});

tape('[code-words-filter] ignores non-code-words', (t) => {
  const shield = new Shield();
  shield.addPlugin(CodeWordsFilter);
  shield.addPlugin(finder);

  const input = 'lhjsdb897623kbjab no one has disproven timecube ::9870sbh';
  const filtered = shield.preprocessString(input);
  t.equal(filtered, input, '[code-words-filter] ignores non-high-entropy-code-word strings');
  t.end();
});
