
// import dependencies
import React from 'react';
import { Box } from '@dashup/ui';

// text field
const FieldDiscountView = (props = {}) => {

  // return text field
  return (
    <Box>
      { (props.value?.type || 'amount') === 'amount' ? '$' : '' }{ parseFloat(props.value?.value || 0).toFixed(2) }{ props.value?.type === 'percent' ? '%' : '' }
    </Box>
  );
};

// export default
export default FieldDiscountView;