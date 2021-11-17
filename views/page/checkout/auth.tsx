
// import react
import React from 'react';
import { TextField, MenuItem } from '@dashup/ui';

// create page model config
const PageCheckoutAuth = (props = {}) => {

  // get auth
  const getAuth = () => {
    // get forms
    const auths = Array.from(props.dashup.get('pages').values()).filter((page) => {
      // return model pages
      return page.get('type') === 'auth' && !page.get('archived');
    });

    // return mapped
    return auths.map((auth) => {
      // return values
      return {
        value : auth.get('_id'),
        label : auth.get('name'),

        selected : props.page.get('data.auth') === auth.get('_id'),
      };
    });
  };

  // return jsx
  return (
    <TextField
      label="Choose Model"
      value={ props.page.get('data.auth') }
      select
      onChange={ (e) => props.setData('auth', e.target.value) }
      fullWidth
      helperText="The authentication this checkout can use."
    >
      { getAuth().map((option) => (
        <MenuItem key={ option.value } value={ option.value }>
          { option.label }
        </MenuItem>
      ))}
    </TextField>
  );
};

// export default
export default PageCheckoutAuth;