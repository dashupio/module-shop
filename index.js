// require first
const { Module } = require('@dashup/module');

// import base
const OrderField = require('./fields/order');
const ProductField = require('./fields/product');
const CheckoutPage = require('./pages/checkout');
const DiscountField = require('./fields/discount');

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
    fn('field', DiscountField);
  }
}

// create new
module.exports = new ShopModule();
