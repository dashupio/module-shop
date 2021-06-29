
// import dependencies
import React from 'react';
import dotProp from 'dot-prop';

// text field
const FieldOrderView = (props = {}) => {

  // get value
  const value = props.value || {};

  // get product field
  const getProduct = (product, key, d) => {
    // checkout
    const checkout = value.checkout && props.dashup.page(value.checkout);

    // check checkout
    if (!checkout) return;

    // product field
    const productField = checkout.field('product', key.split('.')[0]) || {};

    // return
    return dotProp.get(product.product, `${productField.name || productField.uuid}${key.split('.').length > 1 ? `.${key.split('.').slice(1).join('.')}` : ''}`) || d;
  };


  // return text field
  return (
    <div>
      { (value.payments || []).map((payment, i) => {
        // return jsx
        return (
          <span key={ `payment-${i}` } className={ `me-2 btn btn-sm btn-${['succeeded', 'active'].includes(payment.status) ? 'success' : 'danger'}` }>
            <i className={ `fab fa-${payment.type} me-2` } />
            ${ parseFloat(((payment.amount || [])[0] || 0) - ((payment.discount || [])[0] || 0)).toFixed(2) } { (payment.amount || [])[1] } { (payment.amount || [])[2] }
          </span>
        );
      }) }
      { (value.products || []).map((product, i) => {
        // return jsx
        return (
          <span key={ `product-${i}` }>
            { i !== 0 ? ', ' : '' }
            { (product.count || 1).toLocaleString() }
            <i className="fa fa-times me-2" />
            <b>{ getProduct(product, 'title') }</b>
          </span>
        );
      }) }
    </div>
  );
};

// export default
export default FieldOrderView;