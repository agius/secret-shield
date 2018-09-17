'use strict';

const tape = require('tape');

const Shield = require('../../../lib/shield');
const LongEntropy = require('../../../lib/plugins/long-entropy');
const ShortEntropy = require('../../../lib/plugins/short-entropy');

const highStr = '5k8anhaaf6d80cnc81cokm71mcbd0jc8oi4l9o79aj6ci68aemlca8lhjs9qpworuyazmxnvb109284726478465pqowieurytlaksjdhfgzmxncbcv01928374756lskfhskdj2763986bdhjvbljalsjhcbjhbiwuqtuofbpabsa9876769';

const shortStr = '0192837465alskdjfhg';

tape('[long-entropy] long high-entropy string', (t) => {
  const shield = new Shield();
  shield.addPlugin(LongEntropy);

  const findings = shield.processString('lhe token: ' + highStr);

  t.equal(findings.length, 1, 'found a token');
  t.ok(/5k8anhaa/.test('' + findings[0]), 'matches high-entropy string');
  t.end();
});

tape('[long-entropy] long high-entropy string', (t) => {
  const shield = new Shield();
  shield.addPlugin(LongEntropy);

  const lowEntString = Buffer.alloc(50, 'a');
  const findings = shield.processString('lhe token is a token that is here: ' + lowEntString);

  t.equal(findings.length, 0, 'no problemo');
  t.end();
});

tape('[short-entropy] short high-entropy string', (t) => {
  const shield = new Shield();
  shield.addPlugin(ShortEntropy);

  const findings = shield.processString('she string: ' + shortStr);

  t.equal(findings.length, 1, 'found a token');
  t.ok(/0192/.test('' + findings[0]), 'matches high-entropy string');
  t.end();
});

tape('[long-entropy] long high-entropy string', (t) => {
  const shield = new Shield();
  shield.addPlugin(LongEntropy);

  const lowEntString = Buffer.alloc(22, 'a');
  const findings = shield.processString('lhe token is a token that is here: ' + lowEntString);

  t.equal(findings.length, 0, 'no problemo');
  t.end();
});

