
// import dependencies
import React from 'react';

// text field
const FieldDiscountView = (props = {}) => {

  // return text field
  return (
    <div>
      { (props.value?.type || 'amount') === 'amount' ? '$' : '' }{ parseFloat(props.value?.value || 0).toFixed(2) }{ props.value?.type === 'percent' ? '%' : '' }
    </div>
  );
};

// export default
export default FieldDiscountView;