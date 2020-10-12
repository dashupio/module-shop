// require first
const { Module } = require('@dashup/module');

// import base
const CheckoutPage = require('./pages/checkout');

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
  }
}

// create new
module.exports = new ShopModule();
