
// import react
import dotProp from 'dot-prop';
import React, { useRef, useState, useEffect } from 'react';
import { Box, Grid, Stack, Icon, useTheme, Divider, Card, CardContent, TextField, CardMedia, Typography, LoadingButton } from '@dashup/ui';

// shop checkout
const ShopCheckout = (props = {}) => {
  // use theme
  const theme = useTheme();

  // page/dashup
  const { page, dashup } = props;

  // get auth stuff
  const authPage = page.get('data.auth') ? dashup.page(page.get('data.auth')) : props.auth;
  const authForm = authPage && dashup.page(authPage.get('data.form'));

  // email field
  const authEmailField = authForm && (authForm.get('data.fields') || []).find((f) => f.uuid === authPage.get('data.field.email'));

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

  // discount
  const [discount, setDiscount] = useState('');

  // cart page
  const cartPage = page.cart;

  // info
  const [info, setInfo] = useState(props.info || {
    email : props.email || (authPage?.exists() && authEmailField ? authPage.user.get(authEmailField.name || authEmailField.uuid) : ''),
  });

  const [error, setError] = useState(null);
  const [payment, setPayment] = useState(false);
  const [loading, setLoading] = useState(null);
  const [updated, setUpdated] = useState(new Date());
  const [completing, setCompleting] = useState(false);

  // on complete
  const onComplete = async (e) => {
    // prevent
    e.preventDefault();
    e.stopPropagation();

    // check checkout
    if (completing) return;

    // create checkout
    setCompleting(true);
    
    // create object
    const products = page.cart.get('products').map(({ product, opts, count }) => {
      // return products
      return {
        opts,
        count,
        product : product.get('_id'),
      };
    });

    // await call
    const done = await props.dashup.rpc({
      page   : page.get('_id'),
      dashup : dashup.get('_id'),
    }, 'checkout.complete', {
      payment,
      products,

      user     : authPage?.exists() ? authPage.user.get('_id') : null,
      discount : page.cart.get('discount') ? page.cart.get('discount').get('_id') : null,
      information : {
        user : authPage?.exists() ? authPage.user.get('_id') : null,
        ...info
      },
    });

    // check error
    if (!done._id) {
      // create checkout
      setError(done.error);
      setCompleting(false);

      // on error
      if (props.onError) props.onError(done);

      // return
      return;
    }

    // create checkout
    setError(null);
    setCompleting(false);

    // done
    if (props.onSuccess) props.onSuccess(new dashup.Model(done, dashup));

    // clear cart
    page.cart.set(`products`, []);
    page.emit('cart', page.cart);
  };

  // on discount
  const onDiscount = async (e) => {
    // prevent default
    e.preventDefault();
    e.stopPropagation();

    // product field
    const discountCodeField = page.field('discount', 'code') || {};
    const discountUsesField = page.field('discount', 'uses') || {};

    // check code
    if (!discount?.length) return;

    // loading discount
    setLoading('discount');

    // check code
    let actualDiscount = props.dashup.page(page.get('data.discount.form')).where({
      [discountCodeField.name || discountCodeField.uuid] : discount,
    });

    // uses
    if (discountUsesField) {
      actualDiscount = actualDiscount.gt(discountUsesField.name || discountUsesField.uuid, 0);
    }

    // find one
    actualDiscount = await actualDiscount.findOne();

    // set discount
    if (!actualDiscount) {
      // discount
      setLoading(null);
      setDiscountError('Code not found');

      // return
      return;
    }

    // set discount
    await page.code(actualDiscount);

    // loading discount
    setLoading(null);
  }

  // on remove discount
  const onRemoveDiscount = async (e) => {
    // prevent default
    e.preventDefault();
    e.stopPropagation();

    // loading discount
    setLoading('discount');

    // set discount
    await page.code(null);

    // loading discount
    setLoading(null);
  }

  // use effect
  useEffect(() => {
    // check page
    if (!page) return;

    // on update
    const onUpdate = () => {
      // set updated
      setUpdated(new Date());
    };

    // return value
    page.on('cart', onUpdate);

    // return unlisten
    return () => {
      // remove listener
      page.removeListener('cart', onUpdate);
    };
  }, [page && page.get('_id')]);

  // user info
  const customerStep = (
    <Box mb={ 3 } { ...(props.CustomerProps || {}) }>
      <Typography variant="subtitle1" component="h2" sx={ {
        fontWeight : 'bold',
      } } { ...(props.PaymentTitle || {}) }>
        Your Information
      </Typography>
      <Typography variant="subtitle1" component="h4" sx={ {
        mb : 2,
      } } { ...(props.PaymentSubtitle || {}) }>
        Please fill out your information
      </Typography>

      { !!emailField && (
        <dashup.View
          type="field"
          view="input"
          struct="email"

          page={ page }
          field={ emailField }
          value={ info?.email }
          dashup={ dashup }
          readOnly={ !!props.email }
          onChange={ (f, value) => setInfo({ ...info, email : value }) }
        />
      ) }
      { orderFields.map((field) => {
        // return jsx
        return (
          <dashup.View
            type="field"
            view="input"
            struct={ field.type }
    
            page={ page }
            field={ field }
            value={ info[field.name || field.uuid] }
            dashup={ dashup }
            onChange={ (f, value) => setInfo({ ...info, [field.name || field.uuid] : value }) }
          />
        );
      }) }
    </Box>
  );

  // payment sources
  const paymentSources = (props.page.get('connects') || []);
  const paymentSource = paymentSources[0];

  // steps
  const paymentStep = (
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
        <Stack spacing={ 2 } direction="row" width="100%" sx={ {
          mb : 2,
        } } { ...(props.PaymentStackProps || {}) }>
          { paymentSources.map((source) => {
            // return jsx
            return (
              <Card key={ `payment-${source.uuid}` } sx={ {
                flex            : 1,
                color           : paymentSource?.uuid === source.uuid && theme.palette.primary?.main && theme.palette.getContrastText(theme.palette.primary?.main),
                maxWidth        : 180,
                alignItems      : 'center',
                justifyContent  : 'center',
                backgroundColor : paymentSource?.uuid === source.uuid && 'primary.main',
              } } { ...(props.PaymentButtonProps || {}) }>
                <CardContent>
                  { source.icon ? (
                    <Icon icon={ source.icon } />
                  ) : source.type }
                </CardContent>
                <Box />
              </Card>
            );
          }) }
        </Stack>
        { !!paymentSource && (
          <dashup.View
            type="connect"
            view="pay"
            struct={ paymentSource.type }
            connect={ paymentSource }
            
            page={ page }
            value={ payment }
            dashup={ dashup }
            setPayment={ (v) => v ? setPayment({
              type  : paymentSource.type,
              uuid  : paymentSource.uuid,
              value : v,
            }) : setPayment(null) }
          />
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
        <Box my={ 2 }>
          <Divider />
        </Box>
        <Box display="flex" flexDirection="row" { ...(props.CompleteProps || {}) }>
          <LoadingButton variant="contained" size="large" color="success" loading={ completing } disabled={ !!completing || !payment } onClick={ (e) => onComplete(e) } sx={ {
            ml : 'auto',
          } } { ...(props.CompleteButtonProps || {}) }>
            { props.completeButtonText || 'Checkout' }
          </LoadingButton>
        </Box>
      </Grid>
      <Grid item sm={ 12 } md={ 5 } { ...(props.CartProps || {}) } sx={ {
        display       : 'flex',
        flexDirection : 'column',
      } }>
        
        <Stack spacing={ 2 }>
          { (cartPage.get('products') || []).map((line, i) => {
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
            return props.CartItem ? (
              <props.CartItem key={ `product-${i}` } { ...line } parsed={ parsedProduct } />
            ) : (
              <Card key={ `product-${i}` }>
                { !!parsedProduct.image && (          
                  <CardMedia
                    alt={ parsedProduct.title }
                    image={ dotProp.get(parsedProduct, 'image.0.thumbs.2x-sq.url') }
                    component="img"
                  />
                ) }
                <CardContent>
                  <Typography component="div" variant="h5">
                    { (line.count || 1).toLocaleString() }
                    { ' ' }
                    <Icon type="fas" icon="times" />
                    { ' ' }
                    <b>{ parsedProduct.title }</b>
                  </Typography>
                  { !!line?.opts?.title && (
                    <Typography component="div" variant="subtitle1" gutterBottom>
                      { line.opts.title }
                    </Typography>
                  ) }
                  <Typography component="div" variant="subtitle1">
                    { `$${(parseFloat(dotProp.get(parsedProduct, 'field.price') || 0) * line.count).toFixed(2)}` }
                    { ' ' }
                    { dotProp.get(parsedProduct, 'field.type') === 'subscription' && (
                      dotProp.get(parsedProduct, 'field.period') || 'Monthly'
                    ) }
                  </Typography>
                </CardContent>
                <Box />
              </Card>
            );
          }) }
        </Stack>

        <Box display="flex">
          <TextField
            label="Discount Code"
            onChange={ (e) => setDiscount(e.target.value) }
            fullWidth
            InputProps={ {  
              readOnly : !!page.discount(page.total()),
            } }
          />
          <LoadingButton ml={ 2 } loading={ loading === 'discount' } color={ page.discount(page.total()) ? 'error' : undefined } onClick={ (e) => page.discount(page.total()) ? onRemoveDiscount(e) : onDiscount(e) }>
            { page.discount(page.total()) ? (
              <Icon type="fas" icon="times" />
            ) : loading === 'discount' ? 'Applying...' : 'Apply' }
          </LoadingButton>
        </Box>
        
        <Stack spacing={ 0 } mt="auto">
          { Object.entries(page.totals()).map((entry, i) => {

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
          { !!page.discount(page.total()) && (
            <>
              <Divider />
              <Box display="flex" alignItems="center" justifyContent="space-between" p={ 2 }>
                <Typography variant="subtitle1">
                  Discount
                </Typography>
                <Typography variant="subtitle1" fontWeight="bold">
                  { `$${page.discount().toFixed(2)}` }
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
              { `$${((page.total() + page.shipping()) - page.discount(page.total())).toFixed(2)}` }
            </Typography>
          </Box>
        </Stack>

      </Grid>
    </Grid>
  );
};

// export default
export default ShopCheckout;