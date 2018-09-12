'use strict';

const path = require('path');
const fs = require('fs');

const tape = require('tape');

const Shield = require('../lib/shield');

function shieldTape(input, config) {
  tape(input, (t) => {
    const shield = new Shield();

    shield.configure(config).then(() => {
      const findings = shield.processString(input);
      t.ok(findings.length > 0, 'Found a problem');
      t.end();
    }).catch((err) => {
      t.ifErr(err);
      t.end();
    });
  });
}

function noProblemo(input, config) {
  tape(input, (t) => {
    const shield = new Shield();

    shield.configure(config).then(() => {
      const findings = shield.processString(input);
      t.equal(findings.length, 0, 'Did not find a problem');
      t.end();
    }).catch((err) => {
      t.ifErr(err);
      t.end();
    });
  });
}

function loadAsset(filename) {
  return fs.readFileSync(path.resolve(__dirname, 'assets', filename)).toString().trim();
}

shieldTape('[regex-rule] aws key: AKIA0123456789123456');
shieldTape('[regex-rule] aws secret: 0123456789012345678901234567890123456789');
shieldTape('[regex-rule] mapbox key sk.e01234567890123456789.0123456789012345678912');

noProblemo('[regex-remove] an hyperlink: https://www.AKIA0123456789123456.com');
noProblemo('[regex-remove] HTMLStuffThingElement');
noProblemo('[regex-remove] camelCaseStringAkia0123456');
noProblemo('[strings-remove] aws falsepositives: cloudformation:CancelUpdateStack');

shieldTape('[entropy-rule] high entropy string: ' + loadAsset('high-entropy.txt'), 'verydeep');

tape('[length-exclude] excludes long strings without spaces', (t) => {
  const shield = new Shield();

  shield.configure('verydeep').then(() => {
    const findings = shield.processString(loadAsset('long-high-entropy.txt'));
    t.equal(findings.length, 0, 'Did not find a problem');
    t.end();
  }).catch((err) => {
    t.ifErr(err);
    t.end();
  });
});
