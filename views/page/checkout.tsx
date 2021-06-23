
import React from 'react';
import { View } from '@dashup/ui';

// application page
const PageCheckout = (props = {}) => {

  // required
  const required = [{
    key   : 'data.product.model',
    label : 'Product Model',
  }, {
    key   : 'data.product.form',
    label : 'Product Form',
  }, {
    key   : 'data.order.model',
    label : 'Order Model',
  }, {
    key   : 'data.order.form',
    label : 'Order Form',
  }];

  // get props
  const getProps = () => {
    // clone
    const newProps = { ...(props) };

    // delete
    delete newProps.type;
    delete newProps.view;
    delete newProps.struct;

    // return
    return newProps;
  };

  // return jsx
  return (
    <View { ...getProps() } require={ required } type="page" view="view" struct="dashboard" />
  );
};

// export default
export default PageCheckout;