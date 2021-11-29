
// import react
import shortid from 'shortid';
import SimpleBar from 'simplebar-react';
import InfiniteScroll from 'react-infinite-scroll-component';
import React, { useRef, useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, CircularProgress, List, ListItem } from '@dashup/ui';

// block list
const Categories = (props = {}) => {
  // use state
  const [id] = useState(shortid());
  const [listeners] = useState([]);
  const [skip, setSkip] = useState(0);
  const [items, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(25);
  const [updated, setUpdated] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState(props.category);

  // refs
  const scrollRef = useRef();

  // load data
  const loadData = async (newSkip = skip) => {
    // get model page
    const model = props.model || props.page?.get('data.category.model');

    // check model page
    if (!model) return {};

    // get model page
    const modelPage = props.dashup.page(model);

    // check model page
    if (!modelPage) return {};
    
    // list
    return {
      data  : await modelPage.skip(newSkip).limit(limit).listen(),
      total : await modelPage.count(),
    };
  };

  // on update
  const onUpdate = () => {
    // set updated
    setUpdated(new Date());
  };

  // on category
  const onCategory = (category) => {
    // check category
    if (props.setCategory) {
      return props.setCategory(category);
    }

    // set category
    setCategory(category);
  };

  // get category
  const getCategory = () => {
    // return category
    return props.setCategory ? props.category : category;
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
    props.model || props.page?.get('data.category.model'),
  ]);

  // return jsx
  return (
    <Card
      sx={ {
        width         : '100%',
        display       : 'flex',
        maxHeight     : '100%',
        flexDirection : 'column',
      } }

      { ...props.CardProps }
    >
      { !!props.name && (
        <CardContent>
          { props.name }
        </CardContent>
      ) }
      <Box
        sx={ {
          width     : '100%',
          maxHeight : '100%',
        } }
        ref={ scrollRef } 
        component={ SimpleBar }
        scrollableNodeProps={ {
          id,
        } }

        { ...props.ScrollProps }
      >
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
          <List
            disablePadding
            sx={ {
              pt      : props.name ? 0 : 2,
              pb      : 2,
              display : {
                md : 'flex',
                xs : 'inline-flex',
              },
              flexDirection : {
                md : 'column',
                xs : 'row',
              },
              width    : '100%',
              overflow : 'auto',
              flexWrap : 'nowrap',
            } }

            { ...props.ListProps }
          >
            { (items || []).map((item) => {
              // check item
              if (!item || !item.get || !item.toJSON) return null;
            
              // return jsx
              return (
                <ListItem
                  key={ `item-${item.get('_id')}` }
                  onClick={ () => getCategory()?.get('_id') === item.get('_id') ? onCategory(null) : onCategory(item) }
                  disableGutters
                  sx={ {
                    mr : {
                      xs : 2,
                      md : 0,
                    },
                    px : {
                      xs : 0,
                      md : 2
                    },
                    flex       : 0,
                    cursor     : 'pointer',
                    borderLeft : {
                      xs : 'none',
                      md : '3px solid transparent',
                    },
                    borderLeftColor : {
                      md : getCategory()?.get('_id') === item.get('_id') ? 'primary.main' : 'transparent',
                    },
                  } }

                  { ...props.ItemProps }
                >
                  <Typography
                    noWrap
                    color={ getCategory()?.get('_id') === item.get('_id') ? 'primary.main' : 'text.primary' }
                    variant="subtitle1"
                  >
                    { item.get('title') }
                  </Typography>
                </ListItem>
              );
            }) }
          </List>
        </InfiniteScroll>
      </Box>
      <Box />
    </Card>
  );
};

// export block list
export default Categories;