'use strict';

const Finding = require('../finding');

const pubKey = /pk\.e[A-Z-a-z0-9\-_]{20,}\.[A-Z-a-z0-9\-_]{22}/;
const secretKey = /sk\.e[A-Z-a-z0-9\-_=]{20,}\.[A-Z-a-z0-9\-_]{22}/;

function processString(input) {
  input = input.toString();
  const match = input.match(pubKey) || input.match(secretKey);
  if(match === null || match.length <= 0) return;

  return new Finding({
    ruleName: 'Mapbox Token',
    match: match
  });
}

module.exports = {
  processString: processString
};
