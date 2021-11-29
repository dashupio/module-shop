
// import react
import dotProp from 'dot-prop';
import InnerImageZoom from 'react-inner-image-zoom';
import React, { useState, useEffect } from 'react';
import { Box, Stack, Chip, useTheme, Typography, Grid, Tab, TabList, TabPanel, CardHeader, TabContext, Button, Icon, IconButton } from '@dashup/ui';

// styles
import './view.scss';

// item model
const ProductView = (props = {}) => {
  // theme
  const theme = useTheme();

  // get fields
  const getFields = () => {
    // get model page
    const form = props.form || props.page?.get('data.product.form');

    // check model page
    if (!form) return [];

    // get fields
    const formPage = props.dashup.page(form);

    // check page
    if (!formPage) return [];

    // get fields
    return formPage.get('data.fields') || [];
  };

  // get value
  const getValue = (item, type, def = null) => {
    // fields
    const fields = getFields();

    // find field
    const actualField = fields.find((f) => f.uuid === props.page?.get(`data.product.${type}`));

    // check page
    if (!actualField) return null;

    // get form
    return item.get(`${actualField.name || actualField.uuid}`);
  };

  // tabs
  const tabs = props.tabs || ['Content', 'Reviews'];

  // use state
  const [tab, setTab] = useState(`${tabs[0]}`.toLowerCase());
  const [image, setImage] = useState((getValue(props.item, 'image') || [])[0]);
  const [updated, setUpdated] = useState(new Date());

  // use effect
  useEffect(() => {
    // on update
    const onUpdate = () => {
      setUpdated(new Date());
    };

    // listen
    props.page.on('cart', onUpdate);

    // return unlisten
    return () => {
      // unlisten
      props.page.removeListener('cart', onUpdate);
    };
  }, [props.page?.get('_id')]);

  // return jsx
  return (
    <Box>
      <Box mb={ 2 }>
        <Grid container spacing={ 4 }>
          { !!image && (
            <Grid item xs={ 12 } md={ 5 }>
              <Box
                component={ InnerImageZoom }
                borderRadius={ 1 }

                src={ dotProp.get(image,'thumbs.3x-sq.url') }
                zoomSrc={ dotProp.get(image, 'url') }
              />
            </Grid>
          ) }
          <Grid item xs={ 12 } md={ 7 }>
            <Stack spacing={ 3 }>

              <Stack spacing={ 2 } direction="row" sx={ {
                width      : '100%',
                alignItems : 'center',
              } }>
                { (getValue(props.item, 'category') || []).map((item) => {
                  // return item
                  return (
                    <Chip key={ item.get('_id') } label={ item.get('title') } color="primary" />
                  );
                }) }
                
                <Stack sx={ {
                  ml : 'auto!important',
                } } direction="row">
                  <IconButton>
                    <Icon type="fas" icon="heart" />
                  </IconButton>
  
                  <IconButton>
                    <Icon type="fas" icon="share" />
                  </IconButton>
                </Stack>
              </Stack>

              <CardHeader
                sx={ {
                  p : 0,
                } }
                title={ getValue(props.item, 'title') }
                subheader={ getValue(props.item, 'description') }
              />
              
              <Stack>
                <Stack spacing={ 2 } direction="row" sx={ {
                  width      : '100%',
                  display    : 'flex',
                  alignItems : 'center',
                } }>
                  <Typography variant="h5" component="span" sx={ {
                    color      : 'primary.main',
                    fontWeight : 700,
                  } }>
                    { `$${(getValue(props.item, 'field')?.price || 0).toFixed(2)}` }
                    { ' ' }
                    { getValue(props.item, 'field')?.type === 'subscription' && (
                      getValue(props.item, 'field')?.period || 'Monthly'
                    ) }
                  </Typography>

                  { props.page.has(props.item) ? (
                    <Box display="flex" alignItems="center" ml="auto!important">
                      <Button variant="contained" sx={ { px : 1, minWidth : 0 } } onClick={ (e) => props.page.add(props.item, props.page.has(props.item)?.count - 1) }>
                        <Icon type="fas" icon="minus" />
                      </Button>
                      <Typography variant="h5" component="span" sx={ {
                        px         : 3,
                        minWidth   : 50,
                        textAlign  : 'center',
                        fontWeight : 700,
                      } }>
                        { props.page.has(props.item)?.count }
                      </Typography>
                      <Button variant="contained" sx={ { px : 1, minWidth : 0 } } onClick={ (e) => props.page.add(props.item, props.page.has(props.item)?.count + 1) }>
                        <Icon type="fas" icon="plus" />
                      </Button>
                    </Box>
                  ) : (
                    <Button sx={ {
                      ml : 'auto!important',
                    } } variant="contained" size="large" color="primary" startIcon={ (
                      <Icon type="fas" icon="shopping-cart" />
                    ) } onClick={ (e) => props.page.add(props.item) }>
                      Add to Cart
                    </Button>
                  ) }
                </Stack>
              </Stack>
            </Stack>
          </Grid>
        </Grid>
      </Box>
      <TabContext value={ tab }>
        <Box sx={ { borderBottom : 1, borderColor : 'divider' } }>
          <TabList onChange={ (e, v) => setTab(v.toLowerCase()) }>
            { tabs.map((t, i) => {
              // return jsx
              return <Tab key={ `tab-${t}` } value={ t.toLowerCase() } label={ t } />;
            }) }
          </TabList>
        </Box>
        { tabs.map((t, i) => {
          // return jsx
          return (
            <TabPanel key={ `tab-${t}` } value={ t.toLowerCase() } sx={ {
              flex          : 1,
              paddingLeft   : 0,
              paddingRight  : 0,
              paddingBottom : 0,
            } }>
              { `${tab}`.toLowerCase() === 'content' ? (
                <Box dangerouslySetInnerHTML={ { __html : getValue(props.item, 'content') } } />
              ) : 
              `${tab}`.toLowerCase() === 'reviews' ? (
                <Box component="p">
                  No Reviews Yet
                </Box>
              ) : (props[tab] || (
                <Box
                />
              )) }  
            </TabPanel>
          );
        }) }
      </TabContext>
    </Box>
  );
};

// export default
export default ProductView;