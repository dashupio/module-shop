// require first
const { Module } = require('@dashup/module');

// import base
const HostPage = require('./pages/host');

/**
 * export module
 */
class HostModule extends Module {
  
  /**
   * registers dashup structs
   *
   * @param {*} register 
   */
  register(fn) {
    // register sms action
    fn('page', HostPage);
  }
}

// create new
module.exports = new HostModule();
