
// import dependencies
import React from 'react';
import shortid from 'shortid';
import { Form, View, Select } from '@dashup/ui';

// text field
const FieldProduct = (props = {}) => {

  // type
  const getType = () => {
    // values
    return ['Simple', 'Variable', 'Subscription'].map((label) => {
      // value
      const value = label.toLowerCase();

      // return value
      return {
        label,
        value,
        selected : props.value?.type === value,
      }
    });
  };

  // get period
  const getPeriod = () => {
    // return value
    const types = [['weekly', 'Weekly'], ['monthly', 'Monthly'], ['quarterly', 'Quarterly'], ['semiannually', 'Semiannually'], ['annually', 'Annually']];

    // return mapped types
    return types.map((item) => {
      // return value
      return {
        label    : item[1],
        value    : item[0],
        selected : props.value?.period === item[0],
      };
    });
  };

  // set value
  const setValue = (k, v) => {
    // check value
    const value = props.value || {};

    // set value
    value[k] = v;

    // update
    props.onChange(props.field, value);
  };

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
        <div className="card-body">
          <div className="mb-3">
            <label className="form-label">
              { props.field.label || 'Product' } Type
            </label>
            <Select options={ getType() } value={ getType().filter((t) => t.selected) } onChange={ (v) => setValue('type', v?.value) } isClearable />
          </div>

          { !!props.value?.type && (
            <div className="d-flex">
              <div className="flex-1">
                <View
                  type="field"
                  view="input"
                  struct="money"

                  field={ {
                    label : `${props.field.label || 'Product'} Price`,
                  } }
                  page={ props.page }
                  value={ props.value.price }
                  dashup={ props.dashup }
                  onChange={ (f, v) => setValue('price', v) }
                />
              </div>
              { props.value.type === 'subscription' && (
                <div className="flex-1 ms-2">
                  <label className="form-label">
                    { props.field.label || 'Product' } Duration
                  </label>
                  <Select options={ getPeriod() } value={ getPeriod().filter((t) => t.selected) } onChange={ (v) => setValue('period', v?.value) } isClearable />
                </div>
              ) }
            </div>
          ) }
        </div>
        { props.value?.type === 'variable' && (
          <>
            <div className="card-header">
              <label className="m-0">
                { props.field.label || 'Product' } Variations
              </label>
            </div>
            { (props.value?.variations || []).map((variation, i) => {
              // return variation
              return (
                <div key={ `variation-${variation.uuid || i}` } className="card-body">
                  <View
                    type="field"
                    view="input"
                    struct="money"

                    field={ {
                      label : `${props.field.label || 'Product'} Variation Price`,
                    } }
                    page={ props.page }
                    value={ variation.price }
                    dashup={ props.dashup }
                    onChange={ (f, v) => setValue(`variations.${i}.price`, v) }
                  />

                  <div className="d-flex">
                    <button type="button" className="btn btn-danger ms-auto" onClick={ (e) => {
                      // splice
                      const variations = props.value.variations || [];

                      // splice
                      variations.splice(i, 1);

                      // update
                      setValue('variations', variations);
                    } }>
                      Remove Variation
                    </button>
                  </div>
                </div>
              );
            }) }
          
            <div className="card-footer d-flex">
              <button type="button" className="btn btn-success ms-auto" onClick={ (e) => setValue('variations', [...(props.value?.variations || []), {
                uuid : shortid(),
              }]) }>
                Add Variation
              </button>
            </div>
          </>
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
export default FieldProduct;