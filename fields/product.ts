
// import field interface
import { Struct } from '@dashup/module';

/**
 * build address helper
 */
export default class ProductField extends Struct {
  /**
   * construct stripe connector
   *
   * @param args 
   */
  constructor(...args) {
    // run super
    super(...args);

    // bind methods
    this.submitAction = this.submitAction.bind(this);
  }

  /**
   * returns object of views
   */
  get views() {
    // return object of views
    return {
      view  : 'field/product/view',
      input : 'field/product',
    };
  }

  /**
   * gets data
   */
  get data() {
    // return data
    return {
      tabs : ['Display', 'Validate'],
      subs : [
        {
          key   : 'type',
          type  : 'text',
          title : 'Type',
        },
        {
          key   : 'price',
          type  : 'money',
          title : 'Price',
        },
      ],
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
   * returns connect actions
   */
  get actions() {
    // return connect actions
    return {
      submit : this.submitAction,
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
    return 'Product Field';
  }
  /**
   * returns sanitised result of field submission
   *
   * @param {*} param0 
   * @param {*} field 
   * @param {*} value 
   */
  async submitAction(opts, field, value) {
    // check value
    if (!value) value = {};

    // check price
    if (value.price) value.price = parseFloat(value.price);

    // return value
    return { value };
  }
}