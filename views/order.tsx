
import dotProp from 'dot-prop';
import React, { useState, useEffect } from 'react';
import { Box, Grid, Stack, Divider, Card, CardHeader, CardMedia, Typography } from '@dashup/ui';

// shop order
const ShopOrder = (props = {}) => {
  // state
  const [ready, setReady] = useState(false);
  const [order, setOrder] = useState(null);

  // expound props
  const { dashup, page } = props;

  // get order page
  const orderPage   = page.get('data.order.form') ? dashup.page(page.get('data.order.form')) : props.order;
  const orderFields = (page.get('data.order.fields') || []).map((uuid) => (orderPage.get('data.fields') || []).find((f) => f.uuid === uuid));

  // get product page
  const productPage   = page.get('data.product.form') ? dashup.page(page.get('data.product.form')) : props.product;
  const productFields = Object.keys(page.get('data.product') || {}).reduce((accum, k) => {
    accum[k] = (productPage.get('data.fields') || []).find((f) => f.uuid === page.get(`data.product.${k}`));
    return accum;
  }, {});

  // default fields
  const emailField = (orderPage.get('data.fields') || []).find((f) => f.uuid === page.get('data.order.email'));

  // get order field
  const getOrder = (key, d) => {
    // check order
    if (!order) return;

    // product field
    const subField = page.field('order', key.split('.')[0]) || {};

    // return
    return dotProp.get(order.get(), `${subField.name || subField.uuid}${key.split('.').length > 1 ? `.${key.split('.').slice(1).join('.')}` : ''}`) || d;
  };

  // get discount
  const getDiscount = (total) => {
    // check order
    if (!order) return 0;

    // get discount
    const discount = getOrder('field.discount', null);

    // check order
    if (!discount) return 0;

    // total
    if (!total) total = page.total(getOrder('field.products', []));
    
    // parse
    total = parseFloat(total);

    // check value
    if (!discount.type || discount.type === 'amount') {
      // return discount
      return parseFloat(discount.value || '0');
    } else if (discount.type === 'percent') {
      // return discount
      return (parseFloat(discount.value || '0') / 100) * total;
    }

    // get discount
    return 0;
  };

  // get shipping
  const getShipping = () => {
    // return total
    return 0;
  };

  // use effect
  useEffect(() => {
    // check order
    if (!props.order) return;

    // order
    if (typeof props.order === 'string') {
      // find order
      dashup.page(page.get('data.order.form')).findById(props.order).then((order) => {
        setOrder(order);
        setReady(true);
      });
    } else {
      setOrder(props.order);
      setReady(true);
    }
  }, [props.order]);

  // user info
  const customerStep = !!order && (
    <Box mb={ 3 } { ...(props.CustomerProps || {}) }>
      <Typography variant="subtitle1" component="h2" sx={ {
        fontWeight : 'bold',
      } } { ...(props.PaymentTitle || {}) }>
        Your Information
      </Typography>
      <Typography variant="subtitle1" component="h4" sx={ {
        mb : 2,
      } } { ...(props.PaymentSubtitle || {}) }>
        Information filled out for this order.
      </Typography>

      { !!emailField && (
        <dashup.View
          type="field"
          view="input"
          struct="email"
          readOnly

          page={ page }
          field={ emailField }
          value={ getOrder('field.information.email', '') }
          dashup={ dashup }
        />
      ) }
      { orderFields.map((field) => {
        // return jsx
        return (
          <dashup.View
            type="field"
            view="input"
            struct={ field.type }
            readOnly

            page={ page }
            field={ field }
            value={ order.get(field.name || field.uuid) }
            dashup={ dashup }
          />
        );
      }) }
    </Box>
  );

  // steps
  const paymentStep = !!order && (
    <>
      <Box my={ 2 }>
        <Divider />
      </Box>
      <Box { ...(props.PaymentProps || {}) }>
        <Typography variant="subtitle1" component="h2" sx={ {
          fontWeight : 'bold',
        } } { ...(props.PaymentTitle || {}) }>
          Payment Method
        </Typography>
        <Typography variant="subtitle1" component="h4" sx={ {
          mb : 2,
        } } { ...(props.PaymentSubtitle || {}) }>
          Choose Payment Method
        </Typography>
          { !!getOrder('field.payments') && (
            getOrder('field.payments').map((payment, i) => {
              // return jsx
              return (
                <dashup.View
                  key={ `payment-${i}` }
                  view="view"
                  type="connect"
                  page={ page }
                  struct={ payment.type }
                  dashup={ dashup }
                  payment={ payment }
                />
              );
            })
          ) }
      </Box>
    </>
  );

  // return jsx
  return (
    <Grid container spacing={ 2 } { ...(props.ContainerProps || {}) }>
      <Grid item sm={ 12 } md={ 7 } { ...(props.StartProps || {}) }>
        { !!props.logo && (
          <Box textAlign="center" py={ 3 } { ...(props.LogoProps || {}) }>
            <Box component="img" maxWidth={ 240 } mx="auto" src={ props.logo } { ...(props.LogoImgProps || {}) } />
          </Box>
        ) }
        { customerStep }
        { paymentStep }
      </Grid>
      <Grid item sm={ 12 } md={ 5 } { ...(props.CartProps || {}) } sx={ {
        display       : 'flex',
        flexDirection : 'column',
      } }>
        
        <Stack spacing={ 2 }>
          { (getOrder('field.products', []) || []).map((line, i) => {
            // get product obj
            const parsedProduct = Object.keys(productFields).reduce((accum, key) => {
              // field
              const productField = productFields[key];
              
              // get value
              const productValue = productField && line.product && line.product[productField.name || productField.uuid];

              // return
              if (productValue) accum[key] = productValue;

              // return accum
              return accum;
            }, {});

            // return jsx
            return props.CartItem ? (
              <props.CartItem key={ `product-${i}` } { ...line } parsed={ parsedProduct } />
            ) : (
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
                />
                <Box />
              </Card>
            );
          }) }
        </Stack>
        
        <Stack spacing={ 0 } mt="auto">
          { Object.entries(page.totals(getOrder('field.products', []))).map((entry, i) => {

            // return jsx
            return (
              <React.Fragment key={ `entry-${entry[0]}` }>
                { i > 0 && (
                  <Divider />
                ) }
                <Box display="flex" alignItems="center" justifyContent="space-between" p={ 2 }>
                  <Typography variant="subtitle1">
                    { entry[0] !== 'simple' ? `${entry[0].charAt(0).toUpperCase()}${entry[0].slice(1)}` : '' }
                  </Typography>
                  <Typography variant="subtitle1" fontWeight="bold">
                    { `$${parseFloat(entry[1] || 0).toFixed(2)}` }
                  </Typography>
                </Box>
              </React.Fragment>
            );
          }) }
          { !!getDiscount() && (
            <>
              <Divider />
              <Box display="flex" alignItems="center" justifyContent="space-between" p={ 2 }>
                <Typography variant="subtitle1">
                  Discount
                </Typography>
                <Typography variant="subtitle1" fontWeight="bold">
                  { `$${getDiscount().toFixed(2)}` }
                </Typography>
              </Box>
            </>
          ) }

          <Divider />
          <Box display="flex" alignItems="center" justifyContent="space-between" px={ 2 } py={ 3 }>
            <Typography variant="h5">
              Total
            </Typography>
            <Typography variant="h5" fontWeight="bold">
              { `$${((page.total(getOrder('field.products', [])) + getShipping()) - getDiscount()).toFixed(2)}` }
            </Typography>
          </Box>
        </Stack>

      </Grid>
    </Grid>
  );
};

// export default
export default ShopOrder;