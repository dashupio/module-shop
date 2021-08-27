
// import dependencies
import React from 'react';

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
    <div>
      { types[value.type] } ${ parseFloat(value.price || 0).toFixed(2) }
    </div>
  );
};

// export default
export default FieldProductView;