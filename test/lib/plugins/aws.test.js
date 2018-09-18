'use strict';

const tape = require('tape');

const Shield = require('../../../lib/shield');
const AWSPlugin = require('../../../lib/plugins/aws');

const finder = {
  processString: function(input) {
    const match = input.match(/(DescribeAutoScalingNotificationTypes)/i);
    if(match) return new Shield.Finding({
      ruleName: 'High-entropy word matched!',
      match: match
    });
  }
};

tape('[aws-plugin] detects aws public IDs', (t) => {
  const shield = new Shield();
  shield.addPlugin(new AWSPlugin());

  const findings = shield.processString('aws key: AKIA0123456789123456');

  t.equal(findings.length, 1, '[aws-plugin] found a public id');
  t.ok(/AWS Client ID/.test(findings[0]), '[aws-plugin] is a public id violation');
  t.end();
});

tape('[aws-plugin] detects aws private keys', (t) => {
  const shield = new Shield();
  shield.addPlugin(new AWSPlugin({privateKeyRule: true}));

  const findings = shield.processString('aws secret: pqowieury1029384756ALSKDJDHFmznxbvlaksjd');

  t.equal(findings.length, 1, '[aws-plugin] found a secret key');
  t.ok(/AWS Secret Key/.test(findings[0]), '[aws-plugin] is a secret key violation');
  t.end();
});

tape('[aws-plugin] ignores low-entropy private key matches', (t) => {
  const shield = new Shield();
  const plug = new AWSPlugin({
    privateKeyRule: true
  });
  shield.addPlugin(plug);

  const lowEntKey = Buffer.alloc(20, 'a').toString() + Buffer.alloc(20, 'b').toString();
  const findings = shield.processString('aws secret: ' + lowEntKey);

  t.equal(findings.length, 0, '[aws-plugin] found no secret keys');
  t.end();
});

tape('[aws-plugin] private keys with custom entropy', (t) => {
  const shield = new Shield();
  const plug = new AWSPlugin({
    privateKeyRule: true,
    minEntropy: 0.001
  });
  shield.addPlugin(plug);

  const lowEntKey = Buffer.alloc(20, 'a').toString() + Buffer.alloc(20, 'b').toString();
  const findings = shield.processString('aws secret: ' + lowEntKey);

  t.equal(findings.length, 1, '[aws-plugin] found a secret key');
  t.ok(/AWS Secret Key/.test(findings[0]), '[aws-plugin] is a secret key violation');
  t.end();
});

tape('[aws-plugin] ignores non-secret values', (t) => {
  const shield = new Shield();
  shield.addPlugin(new AWSPlugin());

  const input = 'lhjsdb897623kbjab no one has disproven timecube ::9870sbh';
  const filtered = shield.preprocessString(input);
  t.equal(filtered, input, '[aws-plugin] ignores non-secret strings');
  t.end();
});

tape('[aws-plugin] filters out high-entropy AWS words', (t) => {
  const shield = new Shield();
  shield.addPlugin(new AWSPlugin());
  shield.addPlugin(finder);

  const input = 'athena:CancelQueryExecution DescribeAutoScalingNotificationTypes autoscaling:CreateOrUpdateTags';
  const filtered = shield.preprocessString(input);
  const findings = shield.processString(filtered);

  t.equal(findings.length, 0, '[aws-plugin] filter high-entropy-aws-word strings');
  t.end();
});
