'use strict';

const tape = require('tape');

const Shield = require('../../../lib/shield');
const Finding = require('../../../lib/finding');
const UrlFilterPlugin = require('../../../lib/plugins/url-filter');

const timecube = 'https://www.timecube.com';
const urlFinder = {
  processString: function(input) {
    const match =input.match(/(https:\/\/www\.timecube\.com)/);
    if(match) return new Finding({
      ruleName: 'TimeCube Matched!',
      match: match
    });
  }
};

tape('[url-filter-plugin] filters out urls', (t) => {
  const shield = new Shield();
  shield.addPlugin(UrlFilterPlugin);
  shield.addPlugin(urlFinder);

  const filtered = shield.preprocessString(timecube);
  const findings = shield.processString(filtered);

  t.equal(findings.length, 0, '[url-filter-plugin] removed timecube references');
  t.end();
});

tape('[url-filter-plugin] ignores non-urls', (t) => {
  const shield = new Shield();
  shield.addPlugin(UrlFilterPlugin);
  shield.addPlugin(urlFinder);

  const input = 'this string has no urls';
  const filtered = shield.preprocessString(input);
  t.equal(filtered, input, '[url-filter-plugin] ignores non-url strings');
  t.end();
});
