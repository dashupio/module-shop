
// import field interface
import { Struct } from '@dashup/module';

/**
 * build address helper
 */
export default class ProductField extends Struct {

  /**
   * returns object of views
   */
  get views() {
    // return object of views
    return {
      input   : 'field/product/input',
      display : 'field/product/display',
    };
  }
  
  /**
   * returns field type
   */
  get type() {
    // return field type label
    return 'product';
  }

  /**
   * returns field type
   */
  get title() {
    // return field type label
    return 'Product';
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
    return 'Product Field';
  }
}