/* global Money, fx */
"use strict";

var Money = require('../js-money/currency');
var fx = require('money');

//This file puts a currency conversion method on Money.  It's in a separate file to keep Money from
// having a dependency on FX

var assertFxLibraryLoadedWithRates = function() {
  if (!fx || !fx.base || !fx.rates) {
    throw new Error('Fx library not loaded or not initialized with rates');
  }
};

/**
 * Returns a new Money object converted into the requested currency
 * @param {String} toCurrency
 * @returns {String}
 */
Money.prototype.convert = function(toCurrency) {
  var self = this;
  if (!toCurrency || self.getCurrency() === toCurrency) {
    return self;
  }
  assertFxLibraryLoadedWithRates();

  var converted = fx.convert(self.getAmount(), {
    from: self.getCurrency(),
    to: toCurrency.code || toCurrency
  });
  return new Money(converted, toCurrency);
};

/**
 * Adds two money values, but converts the second to match the first
 * @param {[Money]} other money to add
 * @returns {Money}
 */
Money.prototype.addC = function(other) {
  var self = this;
  var o = other;
  if (Money.isMoney(o)) {
    o = o.convert(self.getCurrency());
  }
  return self.add(o);
};

/**
 * Subtracts two money values, but converts the second to match the first
 * @param {[Money]} other money to add
 * @returns {Money}
 */
Money.prototype.subtractC = function(other) {
  var self = this;
  var o = other;
  if (Money.isMoney(o)) {
    o = other.convert(self.getCurrency());
  }
  return self.subtract(o);
};


/**
 * Returns the smallest of the two money objects,  but converts the second to match the first
 *
 * @param {Money} other
 * @returns {Money}
 */
Money.prototype.minC = function(other) {
  var self = this;
  var o = other;
  if (Money.isMoney(o)) {
    o = o.convert(self.getCurrency());
  }

  return self.amount <= o.amount ? self : o;
};

/**
 * Returns the largest of the two money objects,  but converts the second to match the first
 *
 * @param {Money} other
 * @returns {Money}
 */
Money.prototype.maxC = function(other) {
  var self = this;
  var o = other;
  if (Money.isMoney(o)) {
    o = o.convert(self.getCurrency());
  }

  return self.amount >= o.amount ? self : o;
};

/**
 * Gets the current exchange rate
 * @param  {String} fromC [fromCurrency]
 * @param  {String} toC   [toCurrency]
 * @return {Object}  Object containing the rate and the timestamp in MS
 */
Money.getCurrentExchangeRate = function(fromC, toC) {
  var rate = fx.convert(1, {
    from: fromC,
    to: toC
  });
  return {
    rate: fx && rate || 0,
    timestamp: fx && fx.timestamp * 1000 || 0
  };
};

if (typeof module === 'object') {
  module.exports = Money;
}
