
// import dependencies
import React from 'react';
import dotProp from 'dot-prop';
import { Box, Form, View, Select, TextField, MenuItem } from '@dashup/ui';

// text field
const FieldOrder = (props = {}) => {

  // get checkout
  const getCheckout = () => {
    // find pages
    return Array.from(props.dashup.get('pages').values()).filter((p) => p.get('type') === 'checkout').map((page) => {
      // return value
      return {
        label : page.get('name'),
        value : page.get('_id'),

        selected : page.get('_id') === props.value?.checkout,
      };
    });
  };

  // set value
  const setValue = (k, v) => {
    // get value
    const newValue = props.value || {};

    // add value
    newValue[k] = v;

    // on change
    props.onChange(props.field, newValue);
  };

  // get product field
  const getProduct = (product, key, d) => {
    // product field
    const productField = props.dashup.page(props.value?.checkout).field('product', key.split('.')[0]) || {};

    // return
    return dotProp.get(product.product, `${productField.name || productField.uuid}${key.split('.').length > 1 ? `.${key.split('.').slice(1).join('.')}` : ''}`) || d;
  };

  // field body
  const fieldBody = (
    <Box flex={ 1 } pr={ 2 } pb={ 2 } pt={ 1 }>
      <TextField
        label="Checkout Module"
        value={ props.value?.checkout || '' }
        onChange={ (e) => setValue('checkout', e.target.value) }
        select
        fullWidth
      >
        { getCheckout().map((option) => {
          // return jsx
          return (
            <MenuItem key={ option.value } value={ option.value }>
              { option.label }
            </MenuItem>
          );
        }) }
      </TextField>
    </Box>
  );

  // return jsx
  return (
    <TextField
      sx={ {
        '& label': {
          color : props.field.color?.hex,
        },
        '& fieldset': {
          borderColor : props.field.color?.hex,
        },
      } }
      type="hidden"
      size={ props.size }
      label={ props.field.label }
      value="working"
      margin={ props.margin }
      onChange={ (e) => props.onChange(props.field, e.target.value) }
      fullWidth
      helperText={ props.field.help }
      InputProps={ {
        readOnly       : !!props.readOnly,
        startAdornment : fieldBody,
        ...props.InputProps,
      } }
      placeholder={ props.field.placeholder || `Enter ${props.field.label}` }
    />
  );

  // return text field
  return (
    <Form.Group className={ props.noLabel ? '' : 'mb-3' } controlId={ props.field.uuid }>
      <div className="card">
        <div className="card-header">
          { !props.noLabel && (
            <Form.Label>
              { props.field.label || (
                <a href="#!" onClick={ (e) => !props.onConfig(props.field) && e.preventDefault() }>
                  <i>Set Label</i>
                </a>
              ) }  
            </Form.Label>
          ) }
        </div>
        { !!props.value?.checkout && (
          <div className="card-body pt-0">
            { (props.value?.products || []).map((product, i) => {
              // return jsx
              return (
                <div key={ `product-${i}` } className={ `dashup-cart-item row${i > 0 ? ' mt-3' : ''}` }>
                  { !!getProduct(product, 'image.0.thumbs.2x-sq.url') && (
                    <div className="col-4">
                      <img src={ getProduct(product, 'image.0.thumbs.2x-sq.url') } className="img-fluid" />
                    </div>
                  ) }
                  <div className="col d-flex align-items-center">
                    <div className="w-100">
                      <p className="dashup-item-title">
                        <small>
                          { product.count.toLocaleString() }
                          <i className="fal fa-times mx-1" />
                        </small>
                        <b>{ getProduct(product, 'title') }</b>
                      </p>
                      <p className="dashup-item-price">
                        <b>
                          ${ (parseFloat(getProduct(product, 'field.price') || 0) * product.count).toFixed(2) }
                        </b>
                        { getProduct(product, 'field.type') === 'subscription' && (
                          <small className="dashup-item-period ms-2">
                            { getProduct(product, 'field.period') || 'Monthly' }
                          </small>
                        ) }
                      </p>
                    </div>
                  </div>
                </div>
              );
            }) }
            { (props.value?.payments || []).map((payment, i) => {
              // return jsx
              return (
                <View
                  key={ `payment-${i}` }
                  view="view"
                  type="connect"
                  page={ props.dashup.page(props.value.checkout) }
                  struct={ payment.type }
                  dashup={ props.dashup }
                  payment={ payment }
                />
              );
            }) }
          </div>
        ) }
      </div>
      { !!props.field.help && !props.noLabel && (
        <Form.Text className="form-help">
          { props.field.help }
        </Form.Text>
      ) }
    </Form.Group>
  );
};

// export default
export default FieldOrder;