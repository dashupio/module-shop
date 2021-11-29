
// import react
import React from 'react';
import { Box, Card, Stack, CardContent, Typography, TextField, MenuItem, Divider } from '@dashup/ui';

// create page model config
const PageCheckoutDisplay = (props = {}) => {

  // return jsx
  return (
    <>
      <Typography gutterBottom>
        Select Layout
      </Typography>
      <Stack spacing={ 2 } direction="row" sx={ {
        width   : '100%',
        display : 'flex',
      } }>
        <Card variant="outlined" sx={ {
          flex            : 1,
          cursor          : 'pointer',
          backgroundColor : (props.page.get('data.layout') || 'left-column') === 'left-column' ? 'primary.main' : undefined,
        } } onClick={ (e) => props.setData('layout', 'left-column') }>
          <CardContent sx={ {
            display       : 'flex',
            flexDirection : 'row',
          } }>
            <Box height={ 160 } flex={ 1 } mr={ 1 } backgroundColor="rgba(0, 0, 0, 0.2)" borderRadius={ 2 } />
            <Box height={ 160 } flex={ 2 } backgroundColor="rgba(0, 0, 0, 0.2)" borderRadius={ 2 } />
          </CardContent>
          <Box />
        </Card>

        <Card variant="outlined" sx={ {
          flex            : 1,
          cursor          : 'pointer',
          backgroundColor : props.page.get('data.layout') === 'right-column' ? 'primary.main' : undefined,
        } } onClick={ (e) => props.setData('layout', 'right-column') }>
          <CardContent sx={ {
            display       : 'flex',
            flexDirection : 'row',
          } }>
            <Box height={ 160 } flex={ 2 } backgroundColor="rgba(0, 0, 0, 0.2)" borderRadius={ 2 } />
            <Box height={ 160 } flex={ 1 } ml={ 1 } backgroundColor="rgba(0, 0, 0, 0.2)" borderRadius={ 2 } />
          </CardContent>
          <Box />
        </Card>

        <Card variant="outlined" sx={ {
          flex            : 1,
          cursor          : 'pointer',
          backgroundColor : props.page.get('data.layout') === 'one-column' ? 'primary.main' : undefined,
        } } onClick={ (e) => props.setData('layout', 'one-column') }>
          <CardContent sx={ {
            display       : 'flex',
            flexDirection : 'row',
          } }>
            <Box height={ 160 } flex={ 1 } backgroundColor="rgba(0, 0, 0, 0.2)" borderRadius={ 2 } />
          </CardContent>
          <Box />
        </Card>
      </Stack>

      <Box my={ 2 }>
        <Divider />
      </Box>

      <TextField
        label="Container"
        value={ props.page.get('data.container') || 'fullWidth' }
        onChange={ (e) => props.setData('container', e.target.value) }
        fullWidth
        select
      >
        { [['Full Width', 'fullWidth'], ['Centered', 'centered']].map(([label, value]) => {
          // return jsx
          return (
            <MenuItem key={ value } value={ value }>
              { label }
            </MenuItem>
          );
        }) }
      </TextField>

      <TextField
        label="Display"
        value={ props.page.get('data.display') || 'grid' }
        onChange={ (e) => props.setData('display', e.target.value) }
        fullWidth
        select
      >
        { [['Grid', 'grid'], ['Masonry', 'masonry']].map(([label, value]) => {
          // return jsx
          return (
            <MenuItem key={ value } value={ value }>
              { label }
            </MenuItem>
          );
        }) }
      </TextField>
    </>
  );
};

// export default
export default PageCheckoutDisplay;