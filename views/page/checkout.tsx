
import React, { useState, useEffect } from 'react';
import { View, Page, Box, Grid, Stack, Dialog, Button, DialogContent, Container, Card, CardContent, CardActions } from '@dashup/ui';

// application page
const PageCheckout = (props = {}) => {
  // config
  const [share, setShare] = useState(false);
  const [config, setConfig] = useState(false);
  const [updated, setUpdated] = useState(new Date());
  const [category, setCategory] = useState(null);
  const [checkout, setCheckout] = useState(false);

  // required
  const required = [{
    key   : 'data.product.model',
    label : 'Product Model',
  }, {
    key   : 'data.product.form',
    label : 'Product Form',
  }, {
    key   : 'data.order.model',
    label : 'Order Model',
  }, {
    key   : 'data.order.form',
    label : 'Order Form',
  }];

  // on update
  const onUpdate = () => {
    // set updated
    setUpdated(new Date());
  };

  // set tag
  const setTag = async (field, value) => {
    // set tag
    let tags = (props.page.get('user.filter.tags') || []).filter((t) => typeof t === 'object');

    // check tag
    if (tags.find((t) => t.field === field.uuid && t.value === (value?.value || value))) {
      // exists
      tags = tags.filter((t) => t.field !== field.uuid || t.value !== (value?.value || value));
    } else {
      // push tag
      tags.push({
        field : field.uuid,
        value : (value?.value || value),
      });
    }

    // set data
    await props.setUser('filter.tags', tags);
  };

  // set sort
  const setSort = async (column, way = 1) => {
    // let sort
    let sort;

    // check field
    if (
      column && props.page.get('user.sort') &&
      (column.field !== 'custom' && column.field === props.page.get('user.sort.field')) ||
      (column.field === 'custom' && column.sort === props.page.get('user.sort.sort'))
    ) {
      // reverse sort
      if (props.page.get('user.sort.way') === -1) {
        column = null;
      } else {
        way = -1;
      }
    }
    
    // set sort
    if (!column) {
      sort = null;
    } else {
      // create sort
      sort = {
        way,
  
        id    : column.id,
        sort  : column.sort,
        field : column.field,
      };
    }

    // set data
    await props.setUser('sort', sort);
  };

  // set search
  const setSearch = (search = '') => {
    // set page data
    props.page.set('user.search', search.length ? search : null);
  };

  // set filter
  const setFilter = async (filter) => {
    // set data
    props.setUser('query', filter, true);
  };

  // use effect
  useEffect(async () => {
    // check eden
    if (typeof eden === 'undefined') return;

    // get item
    const pageItem = eden?.state?.item;

    // check item
    if (!pageItem) return;

    // load item
    const [
      loadedCategory,
      loadedProduct,
    ] = await Promise.all([
      props.page.get('data.category.model') && props.dashup.page(props.page.get('data.category.model')) && props.dashup.page(props.page.get('data.category.model')).findById(pageItem),
      props.page.get('data.product.model') && props.dashup.page(props.page.get('data.product.model')) && props.dashup.page(props.page.get('data.product.model')).findById(pageItem),
    ]);

    // check category
    if (loadedCategory) setCategory(loadedCategory);
    if (loadedProduct) props.setItem(loadedProduct);
  }, [typeof eden]);

  // use effect
  useEffect(() => {

    // page listeners
    props.page.on('data.sort', onUpdate);
    props.page.on('data.model', onUpdate);
    props.page.on('user.query', onUpdate);
    props.page.on('user.search', onUpdate);
    props.page.on('user.filter', onUpdate);
    props.page.on('data.filter', onUpdate);

    // return nothing
    return () => {
      // page listeners
      props.page.removeListener('data.sort', onUpdate);
      props.page.removeListener('data.model', onUpdate);
      props.page.removeListener('user.query', onUpdate);
      props.page.removeListener('user.search', onUpdate);
      props.page.removeListener('user.filter', onUpdate);
      props.page.removeListener('data.filter', onUpdate);
    };
  }, [
    JSON.stringify(props.page && props.page.get('data.sort')),
    JSON.stringify(props.page && props.page.get('data.model')),
    JSON.stringify(props.page && props.page.get('user.query')),
    JSON.stringify(props.page && props.page.get('user.search')),
    JSON.stringify(props.page && props.page.get('user.filter')),
    JSON.stringify(props.page && props.page.get('data.filter')),
  ]);

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

  // left size
  const categoryColumn = (
    <Stack spacing={ 2 }>
      <View
        type="page"
        view="categories"
        struct="checkout"

        page={ props.page }
        dashup={ props.dashup }

        category={ category }
        setCategory={ (cat) => setCategory(category?.get('_id') === cat?.get('_id') ? null : cat) }
      />

      { !!(props.page.cart && (props.page.cart.get('products') || []).length) && (
        <View
          type="page"
          view="cart"
          struct="checkout"

          page={ props.page }
          dashup={ props.dashup }
        />
      ) }
      { !!(props.page.cart && (props.page.cart.get('products') || []).length) && (
        <Button fullWidth variant="contained" color="primary" onClick={ (e) => setCheckout(true) }>
          Checkout
        </Button>
      ) }
    </Stack>
  );

  // main column
  const mainColumn = (
    <Box flex={ 1 } position="relative" width="100%" height="100%" maxHeight="100%">
      <Box position="absolute" top={ 0 } left={ 0 } right={ 0 } bottom={ 0 }>
        <View
          type="page"
          view="products"
          struct="checkout"
          display={ props.page.get('data.display') }

          page={ props.page }
          dashup={ props.dashup }

          onItem={ (item) => props.setItem(item) }
          category={ category }

          columns={ {
            lg : (props.page.get('data.container') || 'fullWidth') === 'fullWidth' ? 4 : 3,
            md : (props.page.get('data.container') || 'fullWidth') === 'fullWidth' ? 3 : 2,
            sm : 2,
            xs : 1,
          } }
        />
      </Box>
    </Box>
  );

  // return jsx
  return (
    <Page { ...props } onConfig={ () => setConfig(true) } onShare={ () => setShare(true) } require={ required }>

      <Page.Share show={ share } onHide={ (e) => setShare(false) } />
      <Page.Config show={ config } onHide={ (e) => setConfig(false) } />

      <Page.Menu presence={ props.presence } />
      <Page.Filter onSearch={ setSearch } onSort={ setSort } onTag={ setTag } onFilter={ setFilter } isString />
      
      <Page.Body>
        <Box flex={ 1 } position="relative">
          <Box position="absolute" top={ 0 } left={ 0 } right={ 0 } bottom={ 0 }>
            <Container maxWidth={ (props.page.get('data.container') || 'fullWidth') === 'fullWidth' ? false : 'xl' } sx={ {
              px     : (props.page.get('data.container') || 'fullWidth') === 'fullWidth' ? `0!important` : undefined,
              height : '100%',
            } }>
              { (props.page.get('data.layout') || 'left-column') === 'left-column' && (
                <Grid container sx={ {
                  height : '100%',
                } } spacing={ 2 }>
                  <Grid item xs={ 12 } md={ 4 } lg={ (props.page.get('data.container') || 'fullWidth') !== 'fullWidth' ? 3 : 2 } sx={ {
                    height : '100%',
                  } }>
                    { categoryColumn }
                  </Grid>
                  <Grid item xs={ 12 } md={ 8 } lg={ (props.page.get('data.container') || 'fullWidth') !== 'fullWidth' ? 9 : 10 } sx={ {
                    height : '100%',
                  } }>
                    { mainColumn }
                  </Grid>
                </Grid>
              ) }
              { props.page.get('data.layout') === 'right-column' && (
                <Grid container sx={ {
                  height : '100%',
                } } spacing={ 2 }>
                  <Grid item xs={ 12 } md={ 8 } lg={ (props.page.get('data.container') || 'fullWidth') !== 'fullWidth' ? 9 : 10 } sx={ {
                    height : '100%',
                  } }>
                    { mainColumn }
                  </Grid>
                  <Grid item xs={ 12 } md={ 4 } lg={ (props.page.get('data.container') || 'fullWidth') !== 'fullWidth' ? 3 : 2 } sx={ {
                    height : '100%',
                  } }>
                    { categoryColumn }
                  </Grid>
                </Grid>
              ) }
              { props.page.get('data.layout') === 'one-column' && mainColumn }
            </Container>
          </Box>
        </Box>

        { !!checkout && (
          <Dialog
            open={ !!checkout }
            onClose={ () => setCheckout(false) }
            maxWidth="md"
            fullWidth
          >
            <DialogContent>
              <View
                type="page"
                view="checkout"
                struct="checkout"

                page={ props.page }
                dashup={ props.dashup }

                onBack={ () => setCheckout(false) }
              />
            </DialogContent>
          </Dialog>
        ) }

        { !!props.item && (
          <Dialog
            open={ !!props.item }
            onClose={ () => props.setItem(null) }
            maxWidth="md"
            fullWidth
          >
            <DialogContent>
              <View
                type="page"
                view="productView"
                struct="checkout"

                page={ props.page }
                dashup={ props.dashup }

                item={ props.item }
                onItem={ (item) => props.setItem(item) }
              />
            </DialogContent>
          </Dialog>
        ) }
      </Page.Body>
    </Page>
  );
};

// export default
export default PageCheckout;