'use strict';

const tape = require('tape');

const Shield = require('../../../lib/shield');
const Finding = require('../../../lib/finding');
const HtmlFilter = require('../../../lib/plugins/html-filter');

const finder = {
  processString: function(input) {
    const match =input.match(/HTMLMyDomElement/);
    if(match) return new Finding({
      ruleName: 'TimeCube Matched!',
      match: match
    });
  }
};

tape('[html-filter] filters out html element names', (t) => {
  const shield = new Shield();
  shield.addPlugin(HtmlFilter);
  shield.addPlugin(finder);

  const filtered = shield.preprocessString('this has an HTMLMyDomElement in it');
  const findings = shield.processString(filtered);

  t.equal(findings.length, 0, '[html-filter] removed html references');
  t.end();
});

tape('[html-filter] ignores unrelated strings', (t) => {
  const shield = new Shield();
  shield.addPlugin(HtmlFilter);

  const input = 'this has an <HTML> DOM Element in it';
  const filtered = shield.preprocessString(input);
  t.equal(input, filtered, '[html-filter] ignores unrelated strings');
  t.end();
});
