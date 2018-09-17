'use strict';

function preprocessString(input) {
  if(input.indexOf(' ') !== -1) return input;
  if(input.length > 2000) return '';
  return input;
}

module.exports = {
  preprocessString: preprocessString
};
