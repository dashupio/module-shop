
// import react
import React from 'react';

// import config
import Config from './config';

// create page model config
const PageCheckoutDiscount = (props = {}) => {
  // return jsx
  return (
    <Config { ...props } tab="discount" />
  );
};

// export default
export default PageCheckoutDiscount;