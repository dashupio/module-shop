
// import react
import React from 'react';
import { TextField, MenuItem, Divider } from '@dashup/ui';

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
    name : 'User',
    type : 'model',
    help : 'Order user',
  }, {
    name : 'Email',
    type : 'email',
    help : 'Email for Checkout',
  }, {
    name : 'Order',
    type : 'order',
    help : 'Order field type'
  }, {
    name : 'Total',
    type : 'money',
    help : 'Total order amount',
  }, {
    name : 'Discount',
    type : 'money',
    help : 'Total order discount',
  }, {
    name : 'Products',
    type : 'model',
    help : 'Order products',
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
      <TextField
        label={ `${label} Model`}
        value={ getModels(type).filter((f) => f.selected).map((v) => v.value) }
        select
        onChange={ (e) => props.setData(`${type}.model`, e.target.value) }
        fullWidth
        helperText={ `Used for checkout ${label}s` }
      >
        { getModels(type).map((option) => (
          <MenuItem key={ option.value } value={ option.value }>
            { option.label }
          </MenuItem>
        )) }
      </TextField>

      { !!props.page.get(`data.${type}.model`) && (
        <TextField
          label={ `${label} Form`}
          value={ getForms(type).filter((f) => f.selected).map((v) => v.value) }
          select
          onChange={ (e) => props.setData(`${type}.form`, e.target.value) }
          fullWidth
          helperText={ `Used for checkout ${label}s` }
        >
          { getForms(type).map((option) => (
            <MenuItem key={ option.value } value={ option.value }>
              { option.label }
            </MenuItem>
          )) }
        </TextField>
      ) }

      { !!props.page.get(`data.${type}.model`) && !!props.page.get(`data.${type}.form`) && (
        <>
          <Divider />
          { fields.map((field) => {
            // return jsx
            return (
              <TextField
                key={ `group-${type}-${`${field.name || ''}`.toLowerCase()}` }
                label={ `${field.name} Field`}
                value={ getField(type, `${field.name || ''}`.toLowerCase(), field.type).filter((v) => v.selected).map((v) => v.value)[0] || '' }
                select
                onChange={ (e) => onField(type, `${field.name || ''}`.toLowerCase(), e.target.value) }
                fullWidth
                helperText={ field.help || `Used for checkout ${label}s` }
              >
                { getField(type, `${field.name || ''}`.toLowerCase(), field.type).map((option) => (
                  <MenuItem key={ option.value } value={ option.value }>
                    { option.label }
                  </MenuItem>
                )) }
              </TextField>
            );
          }) }
        </>
      ) }
      { type === 'order' && (
        <>
          <Divider />
          <TextField
            label="Extra checkout fields"
            value={ getField('order', 'fields').filter((f) => f.selected).map((v) => v.value) || [] }
            select
            onChange={ (e) => onField(type, 'fields', typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value) }
            fullWidth
            helperText="Extra fields to include in checkout"
            SelectProps={ {
              multiple : true,
            } }
          >
            { getField('order', 'fields').map((option) => (
              <MenuItem key={ option.value } value={ option.value }>
                { option.label }
              </MenuItem>
            )) }
          </TextField>
        </>
      ) }
    </>
  );
};

// export default
export default PageCheckoutConfig;