
// import field interface
import { Struct } from '@dashup/module';

/**
 * build address helper
 */
export default class DiscountField extends Struct {

  /**
   * returns object of views
   */
  get views() {
    // return object of views
    return {
      view  : 'field/discount/view',
      input : 'field/discount',
    };
  }
  
  /**
   * returns field icon
   */
  get icon() {
    // return field type label
    return 'fad fa-percentage';
  }
  
  /**
   * returns field type
   */
  get type() {
    // return field type label
    return 'discount';
  }

  /**
   * returns field type
   */
  get title() {
    // return field type label
    return 'Discount';
  }

  /**
   * returns connect actions
   */
  get actions() {
    // return connect actions
    return {
    };
  }

  /**
   * returns category list to show field in
   */
  get categories() {
    // return array of categories
    return ['frontend'];
  }

  /**
   * returns category list to show field in
   */
  get description() {
    // return description string
    return 'Product Discount Field';
  }
}