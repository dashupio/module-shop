
// import react
import dotProp from 'dot-prop';
import React, { useState, useEffect } from 'react';
import { Box, Icon, Card, Chip, Stack, useTheme, CardMedia, CardHeader, CardContent, IconButton, Grid, Typography } from '@dashup/ui';

// item model
const ProductCard = (props = {}) => {
  // theme
  const theme = useTheme();

  // state
  const [updated, setUpdated] = useState(new Date());

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
  
  // values
  const extraProps = props.display === 'masonry' ? {} : {
    lg   : props.columns?.lg ? (12 / props.columns.lg) : 3,
    md   : props.columns?.md ? (12 / props.columns.md) : 4,
    sm   : props.columns?.sm ? (12 / props.columns.sm) : 6,
    xs   : props.columns?.xs ? (12 / props.columns.xs) : 12,
    item : true,
  };

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
    <Box
      component={ props.display === 'masonry' ? Box : Grid }
      { ...extraProps }

      { ...props.ItemProps }
    >
      <Box
        width={ 1 }
        height={ 1 }
        display="block"
        sx={ {
          transition     : 'all .2s ease-in-out',
          textDecoration : 'none',

          '&:hover' : {
            transform : `translateY(-${theme.spacing(1 / 2)}) scale(1.01)`,
          },
        } }

        { ...props.ItemWrapProps }
      >
        <Box
          width={ 1 }
          height={ 1 }
          component={ Card }
          display="flex"
          flexDirection="column"

          { ...props.ItemCardProps }
        >
          { !!dotProp.get(getValue(props.item, 'image'), '0.thumbs.3x.url') && (
            props.media || (
              <CardMedia
                image={ props.display === 'masonry' ? undefined : dotProp.get(getValue(props.item, 'image'), '0.thumbs.2x-sq.url') }
                title={ getValue(props.item, 'title') }
                onClick={ () => props.onItem && props.onItem(props.item) }

                sx={ {
                  height : props.display === 'masonry' ? undefined : {
                    xs : 160,
                    md : 240,
                  },
                  cursor   : 'pointer',
                  overflow : 'hidden',
                  position : 'relative',
                } }

                { ...props.ItemMediaProps }
              >
                { props.display === 'masonry' && (
                  <Box component="img" width="100%" maxWidth="100%" src={ dotProp.get(getValue(props.item, 'image'), '0.thumbs.2x.url') } />
                ) }
                <Box position="absolute" top={ 0 } left={ 0 } right={ 0 } bottom={ 0 } px={ 2 } py={ 2 } zIndex={ 1 }>
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
                </Box>
              </CardMedia>
            )
          ) }
          <CardHeader
            sx={ {
              cursor : 'pointer',
            } }
            title={ getValue(props.item, 'title') }
            onClick={ () => props.onItem && props.onItem(props.item) }
            subheader={ getValue(props.item, 'description') }
          />
          <CardContent sx={ {
            pt           : 0,
            display      : 'flex',
            alignItems   : 'center',
            flexDirecton : 'row',
          } }>
            <Typography variant="h5" component="span" sx={ {
              color      : 'primary.main',
              cursor     : 'pointer',
              fontWeight : 700,
            } } onClick={ () => props.onItem && props.onItem(props.item) }>
              { `$${(getValue(props.item, 'field')?.price || 0).toFixed(2)}` }
              { ' ' }
              { getValue(props.item, 'field')?.type === 'subscription' && (
                getValue(props.item, 'field')?.period || 'Monthly'
              ) }
            </Typography>

            <IconButton aria-label="settings" color={ props.page.has(props.item) ? 'primary' : undefined } sx={ {
              ml : 'auto',
            } } onClick={ () => props.page.add(props.item, (props.page.has(props.item)?.count || 0) + 1) }>
              <Icon type="fas" icon="shopping-cart" />
            </IconButton>
            { !!props.page.has(props.item) && (
              <Typography variant="subtitle" component="span" sx={ {
                color      : 'primary.main',
                fontWeight : 700,
              } }>
                { props.page.has(props.item)?.count }
              </Typography>
            ) }
          </CardContent>
        </Box>
      </Box>
    </Box>
  );
};

// export default
export default ProductCard;