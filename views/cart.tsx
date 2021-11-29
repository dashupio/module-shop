
import dotProp from 'dot-prop';
import React, { useState, useEffect } from 'react';
import { Box, Stack, Card, CardMedia, CardHeader, Icon, IconButton } from '@dashup/ui';

// create cart
const ShopCart = (props = {}) => {
  // state
  const [updated, setUpdated] = useState(new Date());

  // get products
  const getProducts = () => {
    // get products
    return props.page && props.page.cart ? props.page.cart.get('products') : [];
  };

  // use effect
  useEffect(() => {
    // check page
    if (!props.page) return;

    // on update
    const onUpdate = () => {
      // set updated
      setUpdated(new Date());
    };

    // return value
    props.page.on('cart', onUpdate);

    // return unlisten
    return () => {
      // remove listener
      props.page.removeListener('cart', onUpdate);
    };
  }, [props.page && props.page.get('_id')]);

  // page
  const { page, dashup } = props;

  // check dashup/page
  if (!page || !dashup) return null;
  
  // get product page
  const productPage   = page.get('data.product.form') ? dashup.page(page.get('data.product.form')) : props.product;
  const productFields = Object.keys(page.get('data.product') || {}).reduce((accum, k) => {
    accum[k] = (productPage.get('data.fields') || []).find((f) => f.uuid === page.get(`data.product.${k}`));
    return accum;
  }, {});

  // return jsx
  return (
    <Stack spacing={ 2 }>
      { getProducts().map((line, i) => {
        // get product obj
        const parsedProduct = Object.keys(productFields).reduce((accum, key) => {
          // field
          const productField = productFields[key];
          
          // get value
          const productValue = productField && line.product && line.product.get(productField.name || productField.uuid);

          // return
          if (productValue) accum[key] = productValue;

          // return accum
          return accum;
        }, {});

        // return jsx
        return (
          <Card key={ `product-${i}` } sx={ {
            display : 'flex',
          } }>
            { !!parsedProduct.image && (          
              <CardMedia
                sx={ {
                  width : 85,
                } }
                alt={ parsedProduct.title }
                image={ dotProp.get(parsedProduct, 'image.0.thumbs.2x-sq.url') }
                component="img"
              />
            ) }
            <CardHeader
              sx={ {
                flex : 1,
              } }
              title={ (
                <>
                  { parsedProduct.title }
                </>
              ) }
              subheader={ (
                <>
                  { `x${(line.count || 1).toLocaleString()}` }
                  { ' ' }
                  { ' ' }
                  { `$${(parseFloat(dotProp.get(parsedProduct, 'field.price') || 0) * line.count).toFixed(2)}` }
                  { ' ' }
                  { dotProp.get(parsedProduct, 'field.type') === 'subscription' && (
                    dotProp.get(parsedProduct, 'field.period') || 'Monthly'
                  ) }
                </>
              ) }

              action={ (
                <IconButton onClick={ (e) => props.page.remove(line.product, line.opts) } color="error">
                  <Icon type="fas" icon="trash" />
                </IconButton>
              ) }
            />
            <Box />
          </Card>
        );
      }) }
    </Stack>
  )
};

// export default
export default ShopCart;