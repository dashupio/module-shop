
// import page interface
import { Struct } from '@dashup/module';

/**
 * build address helper
 */
export default class ShopPage extends Struct {
  
  /**
   * construct shop page
   *
   * @param args 
   */
  constructor(...args) {
    // super
    super(...args);

    // shop action
    this.shopAction = this.shopAction.bind(this);
  }

  /**
   * returns page type
   */
  get type() {
    // return page type label
    return 'shop';
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
    return 'Shop Page';
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
      view   : 'page/shop/view',
      config : 'page/shop/config',
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