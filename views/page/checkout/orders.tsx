
// import react
import React from 'react';

// import config
import Config from './config';

// create page model config
const PageCheckoutOrders = (props = {}) => {
  // return jsx
  return (
    <Config { ...props } tab="order" />
  );
};

// export default
export default PageCheckoutOrders;