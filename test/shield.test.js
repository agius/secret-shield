'use strict';

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

shieldTape('my aws key: AKIA0123456789123456');
shieldTape('my aws secret: 0123456789012345678901234567890123456789');
shieldTape('my mapbox key sk.e01234567890123456789.0123456789012345678912');

noProblemo('an hyperlink: https://www.AKIA0123456789123456.com');
noProblemo('an HTML: HTMLStuffThingElement');
noProblemo('an camelCase: camelCaseStringAkia0123456');
noProblemo('aws falsepositives: cloudformation:CancelUpdateStack');
