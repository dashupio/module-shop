
// import dependencies
import React from 'react';
import { Box } from '@dashup/ui';

// text field
const FieldProductView = (props = {}) => {

  // get value
  const value = props.value || {};

  // types
  const types = {
    simple       : 'Simple',
    variable     : 'Variable',
    subscription : 'Subscription',
  };

  // return text field
  return (
    <Box>
      { types[value.type] } ${ parseFloat(value.price || 0).toFixed(2) }
    </Box>
  );
};

// export default
export default FieldProductView;