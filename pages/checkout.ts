
// import page interface
import { Struct } from '@dashup/module';

/**
 * build address helper
 */
export default class CheckoutPage extends Struct {
  
  /**
   * construct checkout page
   *
   * @param args 
   */
  constructor(...args) {
    // super
    super(...args);
  }

  /**
   * returns page type
   */
  get type() {
    // return page type label
    return 'checkout';
  }

  /**
   * returns page type
   */
  get icon() {
    // return page type label
    return 'fa fa-align-justify';
  }

  /**
   * returns page type
   */
  get title() {
    // return page type label
    return 'Checkout Page';
  }

  /**
   * returns page data
   */
  get actions() {
    // return page data
    return {
      
    };
  }

  /**
   * returns object of views
   */
  get views() {
    // return object of views
    return {
      order    : 'order',
      checkout : 'checkout',

      view     : 'page/checkout/view',
      config   : 'page/checkout/config',
      connects : 'page/checkout/connects',
    };
  }

  /**
   * returns category list for page
   */
  get categories() {
    // return array of categories
    return ['frontend'];
  }

  /**
   * returns page descripton for list
   */
  get description() {
    // return description string
    return 'Page Descripton';
  }
}