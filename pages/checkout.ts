
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
    return 'fad fa-shopping-cart text-primary';
  }

  /**
   * returns page type
   */
  get title() {
    // return page type label
    return 'Checkout';
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
   * returns page data
   */
  get data() {
    // return page data
    return {
      tabs    : ['Display', 'Product', 'Category', 'Orders', 'Auth', 'Discount', 'Connects'],
      share   : {
        acls  : ['view'],
        pages : {
          'data.order.model'    : false,
          'data.product.form'   : false,
          'data.product.model'  : false,
          'data.category.form'  : false,
          'data.category.model' : false,
          'data.discount.model' : false,
        },
      },
      default : {
        title : 'The Checkout page requires a couple models in order for data to be submitted to it, do you want us to create those pages page?',
        check : [
          'data.product.model',
        ],
        pages : [
          {
            _id    : 'product',
            type   : 'model',
            icon   : 'boxes fas',
            name   : 'Products',
            parent : '{{ _id }}',
          },
          {
            _id  : 'createProduct',
            type : 'form',
            icon : 'plus fas',
            name : 'Create',
            data : {
              model  : '{{ product }}',
              fields : [
                {
                  type   : 'product',
                  uuid   : 'product',
                  name   : 'product',
                  label  : 'Product',
                  order  : 0,
                  parent : 'root',
                },
                {
                  type   : 'image',
                  uuid   : 'image',
                  name   : 'image',
                  label  : 'Image',
                  order  : 1,
                  parent : 'root',
                },
                {
                  type   : 'text',
                  uuid   : 'title',
                  name   : 'title',
                  label  : 'Title',
                  order  : 2,
                  parent : 'root',
                },
                {
                  type   : 'text',
                  uuid   : 'sku',
                  name   : 'sku',
                  label  : 'SKU',
                  order  : 3,
                  parent : 'root',
                },
                {
                  by       : 'title',
                  uuid     : 'categories',
                  type     : 'model',
                  name     : 'categories',
                  form     : '{{ createCategory }}',
                  model    : '{{ category }}',
                  order    : 4,
                  label    : 'Categories', 
                  parent   : 'root',
                  multiple : true,
                },
                {
                  type   : 'textarea',
                  uuid   : 'description',
                  name   : 'description',
                  label  : 'Description',
                  order  : 5,
                  parent : 'root',
                },
                {
                  type   : 'wysiwyg',
                  uuid   : 'content',
                  name   : 'content',
                  label  : 'Content',
                  order  : 6,
                  parent : 'root',
                },
              ],
            },
            parent : '{{ product }}',
          },
          {
            _id    : 'order',
            type   : 'model',
            icon   : 'cart-plus fas',
            name   : 'Orders',
            parent : '{{ _id }}',
          },
          {
            _id  : 'createOrder',
            type : 'form',
            icon : 'plus fas',
            name : 'Create',
            data : {
              model  : '{{ order }}',
              fields : [
                {
                  uuid   : 'order',
                  type   : 'order',
                  name   : 'order', 
                  order  : 0,
                  label  : 'Order', 
                  parent : 'root',
                },
                {
                  uuid   : 'email',
                  type   : 'email',
                  name   : 'email', 
                  order  : 1,
                  label  : 'Email', 
                  parent : 'root',
                },
                {
                  uuid   : 'total',
                  type   : 'money',
                  name   : 'money', 
                  order  : 2,
                  label  : 'Money', 
                  parent : 'root',
                },
                {
                  uuid   : 'discount',
                  type   : 'money',
                  name   : 'discount', 
                  order  : 3,
                  label  : 'Discount', 
                  parent : 'root',
                },
                {
                  by       : 'sku',
                  uuid     : 'products',
                  type     : 'model',
                  name     : 'products',
                  form     : '{{ createProduct }}',
                  model    : '{{ product }}',
                  order    : 4,
                  label    : 'Products', 
                  parent   : 'root',
                  multiple : true,
                },
              ],
            },
            parent : '{{ order }}',
          },
          {
            _id    : 'discount',
            type   : 'model',
            icon   : 'money-bill fas',
            name   : 'Discounts',
            parent : '{{ _id }}',
          },
          {
            _id  : 'createDiscount',
            type : 'form',
            icon : 'plus fas',
            name : 'Create',
            data : {
              model  : '{{ discount }}',
              fields : [
                {
                  uuid   : 'code',
                  type   : 'text',
                  name   : 'code',
                  order  : 0,
                  label  : 'Code',
                  parent : 'root',
                },
                {
                  uuid   : 'uses',
                  type   : 'number',
                  name   : 'uses',
                  order  : 1,
                  label  : 'Uses',
                  parent : 'root',
                },
                {
                  uuid   : 'discount',
                  type   : 'discount',
                  name   : 'discount',
                  order  : 2,
                  label  : 'Discount',
                  parent : 'root',
                },
              ],
            },
            parent : '{{ discount }}',
          },
          {
            _id    : 'category',
            type   : 'model',
            icon   : 'filter fas',
            name   : 'Categories',
            parent : '{{ _id }}',
          },
          {
            _id  : 'createCategory',
            type : 'form',
            icon : 'plus fas',
            name : 'Create',
            data : {
              model  : '{{ category }}',
              fields : [
                {
                  uuid   : 'title',
                  type   : 'text',
                  name   : 'title',
                  order  : 0,
                  label  : 'Title',
                  parent : 'root',
                },
                {
                  uuid   : 'description',
                  type   : 'textarea',
                  name   : 'description',
                  order  : 1,
                  label  : 'Description',
                  parent : 'root',
                },
              ],
            },
            parent : '{{ category }}',
          },
        ],
        replace : {
          'data.order' : {
            form     : '{{ createOrder }}',
            model    : '{{ order }}',
            field    : 'order',
            email    : 'email',
            total    : 'total',
            discount : 'discount',
            products : 'products',
          },
          'data.product' : {
            form        : '{{ createProduct }}',
            model       : '{{ product }}',
            field       : 'product',
            title       : 'title',
            image       : 'image',
            content     : 'content',
            category    : 'categories',
            description : 'description',
          },
          'data.category' : {
            form        : '{{ createCategory }}',
            model       : '{{ category }}',
            title       : 'title',
            description : 'description',
          },
          'data.discount' : {
            form     : '{{ createDiscount }}',
            code     : 'code', 
            uses     : 'uses', 
            model    : '{{ discount }}',
            discount : 'discount',
          },
        },
      },
    };
  }

  /**
   * returns object of views
   */
  get views() {
    // return object of views
    return {
      cart       : 'cart',
      order      : 'order',
      checkout   : 'checkout',
      products   : 'products',
      categories : 'categories',

      productCard : 'product/card',
      productView : 'product/view',

      view     : 'page/checkout',
      auth     : 'page/checkout/auth',
      orders   : 'page/checkout/orders',
      display  : 'page/checkout/display',
      product  : 'page/checkout/product',
      category : 'page/checkout/category',
      discount : 'page/checkout/discount',

    };
  }

  /**
   * returns category list for page
   */
  get categories() {
    // return array of categories
    return ['Shop'];
  }

  /**
   * returns page descripton for list
   */
  get description() {
    // return description string
    return 'Embeddable E-commerce checkout system';
  }
}