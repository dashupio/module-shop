
// import dependencies
import React from 'react';
import shortid from 'shortid';
import dotProp from 'dot-prop';
import { Box, TextField, MenuItem, Card, CardHeader, View, Button, IconButton, Icon, CardContent } from '@dashup/ui';

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
    dotProp.set(value, k, v);

    // update
    props.onChange(props.field, value);
  };

  // field body
  const fieldBody = (
    <Box flex={ 1 } pr={ 2 } pb={ 2 } pt={ 1 }>
      <TextField
        label={ `${props.field.label || 'Product'} Type` }
        value={ props.value?.type || '' }
        select
        onChange={ (e) => setValue('type', e.target.value) }
        fullWidth
      >
        { getType().map((option) => {
          // return jsx
          return (
            <MenuItem key={ option.value } value={ option.value }>
              { option.label }
            </MenuItem>
          );
        }) }
      </TextField>
      { !!props.value?.type && (
        <View
          type="field"
          view="input"
          struct="money"
          fullWidth

          field={ {
            label : `${props.field.label || 'Product'} Price`,
          } }
          page={ props.page }
          value={ props.value?.price }
          dashup={ props.dashup }
          onChange={ (f, v) => setValue('price', v) }
        />
      ) }
      { props.value?.type === 'subscription' && (
        <TextField
          label={ `${props.field.label || 'Product'} Duration` }
          value={ props.value?.duration }
          select
          onChange={ (e) => setValue('period', e.target.value) }
          fullWidth
        >
          { getPeriod().map((option) => {
            // return jsx
            return (
              <MenuItem key={ option.value } value={ option.value }>
                { option.label }
              </MenuItem>
            );
          }) }
        </TextField>
      ) }
      { props.value?.type === 'variable' && (
        <>
          { (props.value?.variations || []).map((variation, i) => {
            // return variation
            return (
              <Card key={ `model-${variation.uuid}` } sx={ {
                mt : 1,
              } } variant="outlined">
                <CardHeader
                  title={ `${variation.name || `Variation #${i}`}${variation.price ? ` $${variation.price.toFixed(2)}` : ''}` }
                  action={ (
                    <>
                      <IconButton onClick={ (e) => setValue(`variations.${i}.open`, !variation.open) }>
                        <Icon type="fas" icon={ variation.open ? 'times' : 'pencil' } />
                      </IconButton>
                      <IconButton onClick={ (e) => {
                        // splice
                        const variations = props.value.variations || [];

                        // splice
                        variations.splice(i, 1);

                        // update
                        setValue('variations', variations);
                      } } color="error">
                        <Icon type="fas" icon="trash" />
                      </IconButton>
                    </>
                  ) }
                />
                { !!variation.open && (
                  <CardContent>
                    <View
                      type="field"
                      view="input"
                      struct="text"
    
                      field={ {
                        label : `${props.field.label || 'Product'} Variation Name`,
                      } }
                      page={ props.page }
                      value={ variation.name }
                      dashup={ props.dashup }
                      onChange={ (f, v) => setValue(`variations.${i}.name`, v) }
                    />
                    <View
                      type="field"
                      view="input"
                      struct="text"
    
                      field={ {
                        label : `${props.field.label || 'Product'} Variation SKU`,
                      } }
                      page={ props.page }
                      value={ variation.sku }
                      dashup={ props.dashup }
                      onChange={ (f, v) => setValue(`variations.${i}.sku`, v) }
                    />
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
                      onChange={ (f, v) => setValue(`variations.${i}.price`, parseFloat(v)) }
                    />
                  </CardContent>
                ) }
                <Box />
              </Card>
            );
          }) }
        
          <Box justifyContent="end" mt={ 2 }>
            <Button color="success" variant="contained" onClick={ (e) => setValue('variations', [...(props.value?.variations || []), {
              uuid : shortid(),
            }]) }>
              Add Variation
            </Button>
          </Box>
        </>
      ) }
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
};

// export default
export default FieldProduct;