
import React, { useState, useEffect } from 'react';

// create cart
const ShopCart = (props = {}) => {
  // state
  const [updated, setUpdated] = useState(new Date());

  // on remove
  const onRemove = (product) => {
    // do in cart
    props.page.remove(product.product);
  };

  // on count
  const onCount = (product, count) => {
    // do in cart
    props.page.add(product.product, parseInt(count));
  };

  // on add
  const onAdd = (product) => {
    // on count
    return onCount(product, product.count + 1);
  };

  // subtract
  const onSubtract = (product) => {
    // on count
    return onCount(product, product.count - 1);
  };

  // get class
  const getClass = (name, def) => {
    // get classes
    const classes = props.classes || {};

    // check name
    if (!classes[name]) return def;

    // return props
    return classes[name];
  };

  // get products
  const getProducts = () => {
    // get products
    return props.page && props.page.cart ? props.page.cart.get('products') : [];
  };

  // get field
  const getField = (name, tld = 'product') => {
    // return field
    return props.page.field(tld, name);
  };

  // get title
  const getTitle = (product) => {
    // field
    const field = getField('title');

    // check field
    if (!field) return;

    // get product
    const title = product.product.get(field.name || field.uuid);

    // title
    if (props.getTitle) return props.getTitle(product, title);

    // title
    return title;
  };

  // get image
  const getImage = (product) => {
    // field
    const field = getField('image');

    // check field
    if (!field) return;

    // images
    let images = product.product.get(field.name || field.uuid);

    // check
    if (!images) return;

    // check image
    if (!Array.isArray(images)) images = [images];

    // title
    if (props.getImage) return props.getImage(product, images);
    
    // return url
    return (((images[0] || {}).thumbs || {})['2x-sq'] || {}).url;
  };

  // get price
  const getPrice = (product) => {
    // field
    const field = getField('field');

    // check field
    if (!field) return 0;

    // get product
    const prod = product.product.get(field.name || field.uuid);

    // title
    if (props.getPrice) return props.getPrice(product, prod);

    // return price
    return (prod || {}).price || 0;
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

  // return jsx
  return (
    <div className={ getClass('cart', 'dashup-cart') }>
      { getProducts().map((product, i) => {
        // return jsx
        return (
          <div key={ `product-${product.product.get('_id')}-${i}` } className={ getClass('cartItem', 'dashup-cart-item row mb-3') }>
            { !!getImage(product) && (
              <div className={ getClass('cartItemImage', 'col-4') }>
                <img src={ getImage(product) } className={ getClass('cartItemImageImg', 'img-fluid') } />
              </div>
            ) }
            <div className={ getClass('cartItemInfo', 'col') }>
              <h2 className={ getClass('cartItemTitle', 'dashup-item-title') }>
                { getTitle(product) }
              </h2>
              <p className={ getClass('cartItemPrice', 'dashup-item-price') }>
                ${ getPrice(product).toFixed(2) }
              </p>

              <div className={ getClass('cartItemCart', 'dashup-item-qty row') }>
                { !props.disableAmount && (
                  <div className={ getClass('cartItemQty', 'col-7') }>
                    
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <button className="btn btn-outline-dark" type="button" onClick={ (e) => onAdd(product) }>
                          +
                        </button>
                      </div>
                      <input type="number" className="form-control text-center" value={ product.count } onChange={ (e) => onCount(product, e.target.value) } />
                      <div className="input-group-append">
                        <button className="btn btn-outline-dark" type="button" onClick={ (e) => onSubtract(product) }>
                          -
                        </button>
                      </div>
                    </div>
                  </div>
                ) }

                <div className={ getClass('cartItemRemove', 'col-5') }>
                  <button className={ getClass('cartItemRemoveBtn', 'btn btn-block btn-outline-dark') } type="button" onClick={ (e) => onRemove(product) }>
                    Remove
                  </button>
                </div>

              </div>
            </div>
          </div>
        );
      }) }
    </div>
  )
};

// export default
export default ShopCart;