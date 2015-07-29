/* global Money */
"use strict";

var Money = require('./money_conversions.js');

var MONEY_TYPE_NAME = 'Money';
Money.prototype.typeName = function() {
  return MONEY_TYPE_NAME;
};

Money.fromJSONValue = function(value) {
  return new Money(value.amount, value.currency, true);
};

Money.prototype.toJSONValue = function() {
  return {
    amount: this.amount,
    currency: this.currency
  };
};

if (typeof module === 'object') {
  module.exports = Money;
}
