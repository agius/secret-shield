'use strict';

const tape = require('tape');

const Shield = require('../../../lib/shield');
const Finding = require('../../../lib/finding');
const CamelFilter = require('../../../lib/plugins/camel-filter');

const camel = 'camelCaseString';
const camelFinder = {
  processString: function(input) {
    const match =input.match(/(camelCaseString)/);
    if(match) return new Finding({
      ruleName: 'camel Matched!',
      match: match
    });
  }
};

tape('[camel-filter] filters out camelCase', (t) => {
  const shield = new Shield();
  shield.addPlugin(CamelFilter);
  shield.addPlugin(camelFinder);

  const filtered = shield.preprocessString(camel);
  const findings = shield.processString(filtered);

  t.equal(findings.length, 0, '[camel-filter] removed camelCase');
  t.end();
});

tape('[camel-filter] ignores NonCamelCase', (t) => {
  const shield = new Shield();
  shield.addPlugin(CamelFilter);
  shield.addPlugin(camelFinder);

  const nonCamel = 'NonCamelCased';
  const filtered = shield.preprocessString(nonCamel);
  t.equal(nonCamel, filtered, '[camel-filter] ignored CapitalCaseString');
  t.end();
});
