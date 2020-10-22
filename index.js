// require first
const { Module } = require('@dashup/module');

// import base
const OrderField = require('./fields/order');
const ProductField = require('./fields/product');
const CheckoutPage = require('./pages/checkout');
const StripeConnect = require('./connects/stripe');

/**
 * export module
 */
class ShopModule extends Module {
  
  /**
   * registers dashup structs
   *
   * @param {*} register 
   */
  register(fn) {
    // register sms action
    fn('page', CheckoutPage);

    // register field action
    fn('field', OrderField);
    fn('field', ProductField);

    // register payments
    fn('connect', StripeConnect);
  }
}

// create new
module.exports = new ShopModule();
