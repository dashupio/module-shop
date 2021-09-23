
// import dependencies
import React from 'react';
import { Form, Dropdown, DropdownButton } from '@dashup/ui';

// text field
const FieldDiscount = (props = {}) => {
  // types
  const types = {
    amount  : 'Amount ($)',
    percent : 'Percentage (%)',
  };

  // return text field
  return (
    <Form.Group className={ props.noLabel ? '' : 'mb-3' } controlId={ props.field.uuid }>
      { !props.noLabel && (
        <Form.Label>
          { props.field.label || (
            <a href="#!" onClick={ (e) => !props.onConfig(props.field) && e.preventDefault() }>
              <i>Set Label</i>
            </a>
          ) }  
        </Form.Label>
      ) }
      <div className="d-flex">
        <DropdownButton className="me-2" title={ types[props.value?.type || 'amount'] }>
          <Dropdown.Item onClick={ () => props.onChange(props.field, { ...(props.value || {}), type : 'amount'}) }>
            Amount ($)
          </Dropdown.Item>
          <Dropdown.Item onClick={ () => props.onChange(props.field, { ...(props.value || {}), type : 'percent'}) }>
            Percentage (%)
          </Dropdown.Item>
        </DropdownButton>
        <Form.Control
          type="number"
          value={ props.value?.value }
          onChange={ (e) => props.onChange(props.field, { ...(props.value || {}), value : parseFloat(e.target.value) }) }
          readOnly={ props.readOnly }
          placeholder={ props.field.placeholder || `Enter ${props.field.label}` }
          />
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
export default FieldDiscount;