
// import react
import React from 'react';

// import config
import Config from './config';

// create page model config
const PageCheckoutProduct = (props = {}) => {
  // return jsx
  return (
    <Config { ...props } tab="product" />
  );
};

// export default
export default PageCheckoutProduct;