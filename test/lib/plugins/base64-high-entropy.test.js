'use strict';

const tape = require('tape');

const Shield = require('../../../lib/shield');
const B64HE = require('../../../lib/plugins/base64-high-entropy');

tape('[b64he-plugin] b64he long random string', (t) => {
  const shield = new Shield();
  const b64 = new B64HE();
  shield.addPlugin(b64);

  const findings = shield.processString('b64he token: 5k8anhaaf6d80cnc81m5982o8lf0g4d4nednf97g8724n3miclhjlclcokm71mcbd0jc8oi4l9o79aj6ci68aemlca8=');

  t.equal(findings.length, 1, 'found a token');
  t.ok(/5k8anhaaf6d/.test('' + findings[0]), 'matches high-entropy string');
  t.end();
});

tape('[b64he-plugin] ignore low entropy', (t) => {
  const shield = new Shield();
  const b64 = new B64HE();
  shield.addPlugin(b64);

  const lowEntropy = ''.padEnd(85, 'a') + 'bbb==';

  const findings = shield.processString('b64he token: ' + lowEntropy);

  t.equal(findings.length, 0, 'no problemo');
  t.end();
});

tape('[b64he-plugin] custom entropy setting', (t) => {
  const shield = new Shield();
  const b64 = new B64HE({ minEntropy: 0.01 });
  shield.addPlugin(b64);

  const medEntropy = ''.padEnd(85, 'a') + Math.random().toString(36).substring(2, 15) + '=';

  const findings = shield.processString('b64he token: ' + medEntropy);

  t.equal(findings.length, 1, 'found medEntropy string');
  t.ok(/a{84,}/.test(findings[0].toString()), 'finding matched generated str');
  t.end();
});
