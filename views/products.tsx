
// import react
import shortid from 'shortid';
import SimpleBar from 'simplebar-react';
import InfiniteScroll from 'react-infinite-scroll-component';
import React, { useRef, useState, useEffect } from 'react';
import { Box, useTheme, Masonry, CircularProgress, Grid } from '@dashup/ui';

// local components
import ProductCard from './product/card';

// block list
const Products = (props = {}) => {
  // theme
  const theme = useTheme();

  // use state
  const [id] = useState(shortid());
  const [listeners] = useState([]);
  const [skip, setSkip] = useState(0);
  const [items, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(25);
  const [updated, setUpdated] = useState(new Date());
  const [loading, setLoading] = useState(false);

  // refs
  const scrollRef = useRef();

  // load data
  const loadData = async (newSkip = skip) => {
    // get model page
    const model = props.model || props.page?.get('data.product.model');

    // check model page
    if (!model) return {};

    // get model page
    const modelPage = props.dashup.page(model);

    // check model page
    if (!modelPage) return {};

    // query
    const getQuery = () => {
      // check category
      let query = modelPage;

      // check query
      if (props.category) {
        // get fields
        const fields = getFields();

        // get field
        const field = fields.find((f) => f.uuid === props.page.get('data.product.category'));

        // set query
        if (field) query = query.where({
          [field.name || field.uuid] : props.category?.get('_id') || props.category,
        });
      }

      // return query
      return query;
    };
    
    // list
    return {
      data  : await getQuery().skip(newSkip).limit(limit).listen(),
      total : await getQuery().count(),
    };
  };

  // on update
  const onUpdate = () => {
    // set updated
    setUpdated(new Date());
  };

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

  // on next
  const onNext = async () => {
    // set loading
    setSkip(limit + skip);
    setLoading(true);

    // load data
    const { data, total } = await loadData(limit + skip);

    // push to listeners
    listeners.push(data);

    // new data
    const newData = [...(items || []), ...data].reduce((accum, item) => {
      // check found
      if (accum.find((i) => i.get('_id') === item.get('_id'))) return accum;

      // push
      accum.push(item);
      return accum;
    }, []);

    // foreach
    newData.forEach((item) => item.id = item.get('_id'));

    // push data
    setData(newData);
    setTotal(total);
    setLoading(false);
  };

  // use effect
  useEffect(() => {
    // check loading
    if (loading || !props.page) return;

    // set loading
    setData([]);
    setTotal(0);
    setLoading(true);

    // load data
    loadData().then((result) => {
      // on update
      if (result.data?.on) result.data.on('update', onUpdate);

      // foreach
      result.data.forEach((item) => item.id = item.get('_id'));

      // set data
      setData(result.data);
      setTotal(result.total);
      setLoading(false);
    });

    // page listeners
    props.page.on('data.category.model', onUpdate);

    // return nothing
    return () => {
      // page listeners
      props.page.removeListener('data.category.model', onUpdate);

      // items
      listeners.forEach((listener) => {
        // remove listener
        listener?.deafen();
        listener?.removeListener('update', onUpdate);
      })
    };
  }, [
    limit,
    props.category?.get('_id') || props.category,
    props.model || props.page?.get('data.category.model'),
  ]);

  // return jsx
  return (
    <Box
      sx={ {
        mt        : -1,
        mx        : -1,
        width     : '100%',
        minHeight : '100%',
        
        '& .infinite-scroll-component' : {
          overflow : 'initial!important',
        },
      } }
      ref={ scrollRef } 
      component={ SimpleBar }
      scrollableNodeProps={ {
        id,
      } }
      
      { ...props.ScrollProps }
    >
      <Box height={ theme.spacing(1) } />
      <InfiniteScroll
        next={ onNext }
        hasMore={ (items || []).length < total }
        dataLength={ (items || []).length }

        loader={ (
          <Box display="flex" py={ 3 } justifyContent="center" alignItems="center">
            <CircularProgress />
          </Box>
        ) }
        scrollableTarget={ id }
      
        { ...props.WrapProps }
      >
        { loading ? (
          <Box display="flex" flex={ 1 } height="100%" width="100%" alignItems="center" justifyContent="center">
            <CircularProgress />
          </Box>
        ) : (
          <Box
            sx={ {
              px       : 1,
              overflow : props.display === 'masonry' ? 'hidden' : undefined,
            } }
            spacing={ props.display === 'masonry' ? 2 : 4 }
            columns={ props.display === 'masonry' ? (props.columns || {
              lg : 4,
              md : 3,
              sm : 2,
              xs : 1,
            }) : undefined }
            component={ props.display === 'masonry' ? Masonry : Grid }
            container={ props.display === 'masonry' ? undefined : true }
        
            { ...props.GridProps }
          >
            { items.map((item, i) => {

              // return jsx
              return (
                <ProductCard key={ item.get('_id') } { ...props } item={ item } />
              );
            }) }
          </Box>
        ) }
      </InfiniteScroll>
    </Box>
  );
};

// export block list
export default Products;