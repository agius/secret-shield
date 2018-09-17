'use strict';

const tape = require('tape');

const Shield = require('../../../lib/shield');
const SlackPlugin = require('../../../lib/plugins/slack');

tape('[slack-plugin] slack token: xoxb-1234567890-SlAcKtOk3n0mGdOnTdOiT456', (t) => {
  const shield = new Shield();
  shield.addPlugin(SlackPlugin);

  const findings = shield.processString('slack token: xoxb-1234567890-SlAcKtOk3n0mGdOnTdOiT456');

  t.equal(findings.length, 1, 'found a token');
  t.ok(/Slack Token/.test('' + findings[0]), 'is a Slack Token');
  t.end();
});
