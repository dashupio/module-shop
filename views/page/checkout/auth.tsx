
// import react
import React from 'react';
import { Select } from '@dashup/ui';

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
    <div className="mb-3">
      <label className="form-label">
        Auth Page
      </label>
      <Select options={ getAuth() } defaultValue={ getAuth().filter((f) => f.selected) } onChange={ (val) => props.setData('auth', val?.value) } isClearable />
      <small>
        Used for checkout login/auth.
      </small>
    </div>
  );
};

// export default
export default PageCheckoutAuth;