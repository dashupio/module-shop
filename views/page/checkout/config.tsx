
// import react
import React from 'react';
import { Select } from '@dashup/ui';

// create page model config
const PageCheckoutConfig = (props = {}) => {

  // product fields
  const productFields = [{
    name : 'Field',
    type : 'product',
  }, {
    name : 'Image',
    type : 'image',
  }, {
    name : 'Title',
    type : 'text',
  }, {
    name : 'Description',
    type : ['textarea', 'wysiwyg'],
  }];

  // order fields
  const orderFields = [{
    name : 'Email',
    type : 'email',
  }, {
    name : 'Address',
    type : 'address',
  }, {
    name : 'Field',
    type : 'order',
  }, {
    name : 'Total',
    type : 'money',
  }, {
    name : 'Products',
    type : 'model',
  }, {
    name : 'User',
    type : 'model',
  }, {
    name : 'Discount',
    type : 'money',
  }];

  // order fields
  const discountFields = [{
    name : 'Code',
    type : 'text',
  }, {
    name : 'Uses',
    type : 'number',
  }, {
    name : 'Discount',
    type : 'discount',
  }];

  // groups
  const groups = {
    order    : ['Order', orderFields],
    product  : ['Product', productFields],
    discount : ['Discount', discountFields],
  };

  // get dashboards
  const getModels = (type = 'product') => {
    // get forms
    const models = Array.from(props.dashup.get('pages').values()).filter((page) => {
      // return model pages
      return page.get('type') === 'model' && !page.get('archived');
    });

    // return mapped
    return models.map((model) => {
      // return values
      return {
        value : model.get('_id'),
        label : model.get('name'),

        selected : (props.page.get(`data.${type}.model`) || []).includes(model.get('_id')),
      };
    });
  };

  // get forms
  const getForms = (type = 'product') => {
    // get forms
    const forms = Array.from(props.dashup.get('pages').values()).filter((page) => {
      // return model pages
      return page.get('type') === 'form' && page.get('data.model') === props.page.get(`data.${type}.model`) && !page.get('archived');
    });

    // return mapped
    return forms.map((form) => {
      // return values
      return {
        value : form.get('_id'),
        label : form.get('name'),

        selected : (props.page.get(`data.${type}.form`) || []).includes(form.get('_id')),
      };
    });
  };
  
  // get field
  const getField = (type, tld, types = []) => {
    // return value
    return props.getFields([props.page.get(`data.${type}.form`)]).map((field) => {
      // check type
      if (types.length && !types.includes(field.type)) return;

      // return fields
      return {
        label : field.label || field.name,
        value : field.uuid,

        selected : (props.page.get(`data.${type}.${tld}`) || []).includes(field.uuid),
      };
    }).filter((f) => f);
  };

  // on forms
  const onField = (type, tld, value) => {
    // set data
    props.setData(`${type}.${tld}`, value || null);
  };

  // get group
  const [label, fields] = groups[props.tab];
  
  // type
  const type = props.tab;

  // return jsx
  return (
    <>
      <div className="mb-3">
        <label className="form-label">
          { label } Model
        </label>
        <Select options={ getModels(type) } defaultValue={ getModels(type).filter((f) => f.selected) } onChange={ (val) => props.setData(`${type}.model`, val?.value) } isClearable />
        <small>
          Used for checkout { label }s.
        </small>
      </div>

      { !!props.page.get(`data.${type}.model`) && (
        <div className="mb-3">
          <label className="form-label">
            { label } Form
          </label>
          <Select options={ getForms(type) } defaultValue={ getForms(type).filter((f) => f.selected) } onChange={ (val) => props.setData(`${type}.form`, val?.value) } isClearable />
          <small>
            Used for checkout { label }s.
          </small>
        </div>
      ) }

      { !!props.page.get(`data.${type}.model`) && !!props.page.get(`data.${type}.form`) && (
        <>
          <hr />
          { fields.map((field) => {
            // return jsx
            return (
              <div key={ `group-${type}-${`${field.name || ''}`.toLowerCase()}` } className="mb-3">
                <label className="form-label">
                  { field.name } Field
                </label>
                <Select options={ getField(type, `${field.name || ''}`.toLowerCase(), field.type) } defaultValue={ getField(type, `${field.name || ''}`.toLowerCase(), field.type).filter((f) => f.selected) } onChange={ (value) => onField(type, `${field.name || ''}`.toLowerCase(), value?.value) } isClearable />
              </div>
            );
          }) }
        </>
      ) }
      <hr />
    </>
  );
};

// export default
export default PageCheckoutConfig;