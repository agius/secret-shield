'use strict';

const Finding = require('../finding');

const patterns = [
  /(xoxp-[0-9]{10}-[0-9]{10}-[0-9]{12}-[a-z0-9]{32})/i,
  /(xoxb-[0-9]{10}-[a-z0-9]{24,})/i
];

function processString(input) {
  const match = patterns.find((pattern) => {
    return input.toString().match(pattern);
  });

  if(match === null || match.length <= 0) return;

  return new Finding({
    ruleName: 'Slack Token',
    match: match
  });
}

module.exports = {
  processString: processString
};
