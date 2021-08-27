
import dotProp from 'dot-prop';
import React, { useState, useEffect } from 'react';

// shop order
const ShopOrder = (props = {}) => {
  // state
  const [ready, setReady] = useState(false);
  const [order, setOrder] = useState(null);

  // expound props
  const { dashup, page } = props;

  // fields
  const orderField = page.field('order', 'field');

  // shipping
  const billing  = page.get(`${orderField.name || orderField.uuid}.information.address`);
  const shipping = page.get(`${orderField.name || orderField.uuid}.shipping.address`);

  // get class
  const getClass = (name, def) => {
    // get classes
    const classes = props.classes || {};

    // check name
    if (!classes[name]) return def;

    // return props
    return classes[name];
  };

  // get order field
  const getOrder = (key, d) => {
    // check order
    if (!order) return;

    // product field
    const subField = page.field('order', key.split('.')[0]) || {};

    // return
    return dotProp.get(order.get(), `${subField.name || subField.uuid}${key.split('.').length > 1 ? `.${key.split('.').slice(1).join('.')}` : ''}`) || d;
  };

  // get discount
  const getDiscount = (total) => {
    // check order
    if (!order) return 0;

    // get discount
    const discount = getOrder('field.discount', null);

    // check order
    if (!discount) return 0;

    // total
    if (!total) total = page.total(getOrder('field.products', []));
    
    // parse
    total = parseFloat(total);

    // check value
    if (!discount.type || discount.type === 'amount') {
      // return discount
      return parseFloat(discount.value || '0');
    } else if (discount.type === 'percent') {
      // return discount
      return (parseFloat(discount.value || '0') / 100) * total;
    }

    // get discount
    return 0;
  };

  // get shipping
  const getShipping = () => {
    // return total
    return 0;
  };

  // get product field
  const getProduct = (product, key, d) => {
    // product field
    const productField = page.field('product', key.split('.')[0]) || {};

    // return
    return dotProp.get(product.product, `${productField.name || productField.uuid}${key.split('.').length > 1 ? `.${key.split('.').slice(1).join('.')}` : ''}`) || d;
  };

  // use effect
  useEffect(() => {
    // check order
    if (!props.order) return;

    // find order
    dashup.page(page.get('data.order.form')).findById(props.order).then((order) => {
      setOrder(order);
      setReady(true);
    });
  }, [props.order])

  // return jsx
  return (
    <div className={ getClass('order', 'dashup-order row') }>
    
      { /* ORDER MAIN */ }
      <div className={ getClass('orderMain', 'dashup-checkout-main col-lg-7 order-1 order-lg-0') }>

        { !!props.logo && (
          <div className={ getClass('orderLogo', 'dashup-order-logo text-center') }>
            <img src={ props.logo } className={ getClass('orderLogoImg', 'w-25 margin-auto') } />
          </div>
        ) }
      
        <div className={ getClass('orderId', 'dashup-order-id text-center mt-3 mb-5') }>
          <span className="text-bold">
            Order #{ order ? order.get('_id') : 'Loading...' }
          </span>
        </div>

        { !!(shipping || billing) && (
          <>
            <div className="card">
              { !!billing && (
                <div className="card-header">
                  <div className="row">
                    <div className="col-5">
                      <b>
                        <small>
                          Bill to
                        </small>
                      </b>
                    </div>
                    <div className="col-7">
                      <small className="text-overflow">
                        { billing.formatted }
                      </small>
                    </div>
                  </div>
                </div>
              ) }
              { !!shipping && (
                <div className="card-header">
                  <div className="row">
                    <div className="col-5">
                      <b>
                        <small>
                          Ship to
                        </small>
                      </b>
                    </div>
                    <div className="col-7">
                      <small className="text-overflow">
                        { shipping.formatted }
                      </small>
                    </div>
                  </div>
                </div>
              ) }
            </div>

            <hr />
          </>
        ) }
        
        { !!getOrder('field.payments') && (
          getOrder('field.payments').map((payment, i) => {
            // return jsx
            return (
              <dashup.View
                key={ `payment-${i}` }
                view="view"
                type="connect"
                page={ page }
                struct={ payment.type }
                dashup={ dashup }
                payment={ payment }
              />
            );
          })
        ) }
      </div>
      
      <div className={ getClass('orderSidebar', 'dashup-checkout-cart col-lg-5 order-0 order-lg-1') }>
        { !!ready && getOrder('field.products', []).map((product, i) => {
          // return jsx
          return (
            <div key={ `product-${i}` } className={ getClass('cartItem', 'dashup-cart-item row mb-3') }>
              { !!getProduct(product, 'image.0.thumbs.2x-sq.url') && (
                <div className={ getClass('cartItemImage', 'col-4') }>
                  <img src={ getProduct(product, 'image.0.thumbs.2x-sq.url') } className={ getClass('cartItemImageImg', 'img-fluid') } />
                </div>
              ) }
              <div className={ getClass('cartItemInfo', 'col d-flex align-items-center') }>
                <div className="w-100">
                  <h2 className={ `${getClass('cartItemTitle', 'dashup-item-title')}${product?.opts?.title ? ' m-0' : ''}` }>
                    <small>
                      { product.count.toLocaleString() }
                      <i className={ getClass('cartItemPriceSep', 'fal fa-fw fa-times mx-1') } />
                    </small>
                    <b>{ getProduct(product, 'title') }</b>
                  </h2>
                  { !!product?.opts?.title && (
                    <p className={ getClass('cartItemTitle', 'dashup-item-variation') }>
                      <small>{ product.opts.title }</small>
                    </p>
                  ) }
                  <p className={ getClass('cartItemPrice', 'dashup-item-price') }>
                    <span>
                      ${ (parseFloat(getProduct(product, 'field.price') || 0) * product.count).toFixed(2) }
                    </span>
                    { getProduct(product, 'field.type') === 'subscription' && (
                      <small className={ getClass('cartItemPeriod', 'dashup-item-period ms-2') }>
                        { getProduct(product, 'field.period') || 'Monthly' }
                      </small>
                    ) }
                  </p>
                </div>
              </div>
            </div>
          );
        }) }

        <hr />

        { !!ready && (
          <div className={ getClass('orderSubtotal', 'dashup-subtotal') }>
            { Object.entries(page.totals(getOrder('field.products', []))).map((entry, i) => {
              // return jsx
              return (
                <div key={ `entry-${i}` } className={ getClass('checkoutSubtotalLine', 'row mb-2') }>
                  <div className={ getClass('checkoutSubtotalLabel', 'col-8') }>
                    { entry[0] !== 'simple' ? `${entry[0].charAt(0).toUpperCase()}${entry[0].slice(1)}` : '' }
                  </div>
                  <div className={ getClass('checkoutSubtotalAmount', 'col-4 text-end')}>
                    <b>${ parseFloat(entry[1] || 0).toFixed(2) }</b>
                  </div>
                </div>
              );
            }) }
            { !!getDiscount() && (
              <div className={ getClass('orderSubtotalLine', 'row mb-2') }>
                <div className={ getClass('orderSubtotalLabel', 'col-8') }>
                  Discount
                </div>
                <div className={ getClass('orderSubtotalAmount', 'col-4 text-end')}>
                  <b>${ getDiscount().toFixed(2) }</b>
                </div>
              </div>
            ) }
            { !!page.get('data.order.shipping') && (
              <div className={ getClass('orderSubtotalLine', 'row mb-2') }>
                <div className={ getClass('orderSubtotalLabel', 'col-8') }>
                  Shipping
                </div>
                <div className={ getClass('orderSubtotalAmount', 'col-4 text-end')}>
                  { page.shipping() ? (
                    <b>${ page.shipping().toFixed(2) }</b>
                  ) : (
                    <i>N/A</i>
                  ) }
                </div>
              </div>
            ) }
          </div>
        ) }

        <hr />
        
        <div className={ getClass('orderTotal', 'dashup-total') }>
          <div className={ getClass('orderTotalLine', 'row mb-2') }>
            <div className={ getClass('orderTotalLabel', 'col-8 d-flex align-items-center') }>
              Total
            </div>
            <div className={ getClass('orderTotalAmount', 'col-4 text-end')}>
              ${ ((page.total(getOrder('field.products', [])) + getShipping()) - getDiscount()).toFixed(2) }
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

// export default
export default ShopOrder;