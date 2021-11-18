
// import dependencies
import React from 'react';
import dotProp from 'dot-prop';
import { Box, Stack, Chip, Avatar, Icon } from '@dashup/ui';

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
    <Stack spacing={ 1 } alignItems="center" direction="row">
      { (value.payments || []).map((payment, i) => {
        // return jsx
        return (
          <Chip
            key={ `payment-${i}` }
            color={ ['succeeded', 'active'].includes(payment.status) ? 'success' : 'error' }
            label={ `${parseFloat(((payment.amount || [])[0] || 0) - parseFloat((payment.discount || [])[0] || 0)).toFixed(2)} ${(payment.amount || [])[1] || ''} ${(payment.amount || [])[2] || ''}` }
            avatar={ (
              <Avatar>
                <Icon type="fab" icon={ payment.type } />
              </Avatar>
            ) }
          />
        );
      }) }
      { (value.products || []).map((product, i) => {
        // return jsx
        return (
          <Chip
            key={ `product-${i}` }
            color="primary"
            label={ `${(product.count || 1).toLocaleString()}x ${getProduct(product, 'title')}` }
            avatar={ (
              <Avatar image={ getProduct(product, 'image') } name={ getProduct(product, 'title') } />
            ) }
          />
        );
      }) }
    </Stack>
  );
};

// export default
export default FieldOrderView;