
// import react
import React from 'react';

// import config
import Config from './config';

// create page model config
const PageCheckoutCategory = (props = {}) => {
  // return jsx
  return (
    <Config { ...props } tab="category" />
  );
};

// export default
export default PageCheckoutCategory;