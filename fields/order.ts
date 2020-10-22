
// import field interface
import { Struct, Query } from '@dashup/module';

/**
 * build address helper
 */
export default class OrderField extends Struct {
  /**
   * construct stripe connector
   *
   * @param args 
   */
  constructor(...args) {
    // run super
    super(...args);

    // bind methods
    this.sanitiseAction = this.sanitiseAction.bind(this);
  }

  /**
   * returns object of views
   */
  get views() {
    // return object of views
    return {
      input   : 'field/order/input',
      display : 'field/order/display',
    };
  }
  
  /**
   * returns field type
   */
  get type() {
    // return field type label
    return 'order';
  }

  /**
   * returns field type
   */
  get title() {
    // return field type label
    return 'Order';
  }

  /**
   * returns connect actions
   */
  get actions() {
    // return connect actions
    return {
      sanitise : this.sanitiseAction,
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
    return 'Order Field';
  }

  /**
   * returns sanitised result of field submission
   *
   * @param {*} param0 
   * @param {*} field 
   * @param {*} value 
   */
  async sanitiseAction(opts, field, value) {
    // get value
    if (!value || !value.checkout) return { sanitised : value };

    // get checkout
    const page = await new Query({
      ...opts,
    }, 'page').findById(value.checkout);
    
    // loop products
    const products = await new Query({
      ...opts,

      page : page.get('data.product.form'),
      form : page.get('data.product.form'),
    }, 'model').findByIds(value.products.map((product) => {
      // set id
      const id = (product.product || {})._id ? product.product._id : product.product;

      // return product
      return id;
    }));

    // loop products
    value.products = await Promise.all(value.products.map(async (product) => {
      // set id
      const id = (product.product || {})._id ? product.product._id : product.product;
      
      // set value
      product.product = await (products.find((p) => p.get('_id') === id)).sanitise();

      // return product
      return product;
    }));

    // return value
    return { sanitised : value };
  }
}