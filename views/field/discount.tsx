
// import dependencies
import React, { useState } from 'react';
import { Icon, TextField, InputAdornment, IconButton, Menu, MenuItem } from '@dashup/ui';

// text field
const FieldDiscount = (props = {}) => {
  // state
  const [menu, setMenu] = useState(null);

  // types
  const types = {
    amount  : 'dollar-sign',
    percent : 'percent',
  };

  return (
    <>
      <TextField
        type="number"
        value={ props.value?.value }
        onChange={ (e) => props.onChange(props.field, { ...(props.value || {}), value : parseFloat(e.target.value) }) }
        helperText={ props.field.help }
        placeholder={ props.field.placeholder || `Enter ${props.field.label}` }
        fullWidth

        InputProps={ {
          ...props.InputProps,
          readOnly       : !!props.readOnly,
          startAdornment : (
            <InputAdornment position="start">
              <IconButton
                edge="start"
                onClick={ (e) => setMenu(e.target) }
              >
                <Icon type="fas" icon={ types[props.value?.type || 'amount'] } />
              </IconButton>
            </InputAdornment>
          )
        } }
      />
      <Menu
        open={ !!menu }
        onClose={ (e) => setMenu(null) }
        anchorEl={ menu }
      >
        <MenuItem onClick={ (e) => props.onChange(props.field, { ...(props.value || {}), type : 'amount' }) }>
          Amount
        </MenuItem>
        <MenuItem onClick={ (e) => props.onChange(props.field, { ...(props.value || {}), type : 'percent' }) }>
          Percentage
        </MenuItem>
      </Menu>
    </>
  );
};

// export default
export default FieldDiscount;