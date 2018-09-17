'use strict';

const UrlIgnorePlugin = require('../url-ignore');
const HtmlElementIgnorePlugin = require('../html-element-ignore');
const CamelCaseIgnorePlugin = require('../camel-case-ignore-plugin');
const CommonFalsePositivesIgnorePlugin = require('../common-false-positives-ignore/common-false-positives-ignore-plugin');
const EnglishWordsIgnorePlugin = require('../english-words-ignore/english-words-ignore-plugin');
const AwsPlugin = require('../aws/aws-plugin');
const LongStringIgnorePlugin = require('../long-string-ignore');

module.exports = function DefaultsMinimal(shield) {
  this.plugins = [
    UrlIgnorePlugin,
    HtmlElementIgnorePlugin,
    CamelCaseIgnorePlugin,
    CommonFalsePositivesIgnorePlugin,
    EnglishWordsIgnorePlugin,
    AwsPlugin,
    LongStringIgnorePlugin
  ];

  for(const plugin of this.plugins) {
    shield.loadPlugin(plugin);
  }
};
