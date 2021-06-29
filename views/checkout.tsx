
// import react
import React, { useRef, useState, useEffect } from 'react';

// shop checkout
const ShopCheckout = (props = {}) => {
  // page/dashup
  const { page, dashup } = props;

  // set dashup
  const auth = page.get('data.auth') ? dashup.page(page.get('data.auth')) : null;
  const cart = page.cart;

  // state
  const [step, setStep] = useState('information');
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const [login, setLogin] = useState(false);
  const [email, setEmail] = useState(
    props.email || (auth && auth.exists() ? auth.user.get(page.field('auth', 'email').name || page.field('auth', 'email').uuid) : '')
  );
  const [payment, setPayment] = useState(false);
  const [loading, setLoading] = useState(null);
  const [updated, setUpdated] = useState(new Date());
  const [billing, setBilling] = useState(null);
  const [shipping, setShipping] = useState(null);
  const [isBilling, setIsBilling] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [discountError, setDiscountError] = useState(null);

  // refs
  const discountRef = useRef(null);
  
  // get class
  const getClass = (name, def) => {
    // get classes
    const classes = props.classes || {};

    // check name
    if (!classes[name]) return def;

    // return props
    return classes[name];
  };

  // get product field
  const getProduct = (product, key, d) => {
    // product field
    const productField = page.field('product', key.split('.')[0]) || {};

    // return
    return product.product.get(`${productField.name || productField.uuid}${key.split('.').length > 1 ? `.${key.split('.').slice(1).join('.')}` : ''}`) || d;
  };

  // get discount
  const getDiscount = (key, d) => {
    // product field
    const discountField = page.field('discount', key.split('.')[0]) || {};

    // return
    return page.cart.get('discount').get(`${discountField.name || discountField.uuid}${key.split('.').length > 1 ? `.${key.split('.').slice(1).join('.')}` : ''}`) || d;
  };

  // has shipping
  const hasShipping = () => {
    // get products
    const products = page.cart.get('products');

    // field
    const productField = page.field('product', 'field');

    // return has shipping
    return !!productField.shipping;
  };

  // on back
  const onBack = (e) => {
    // prevent
    e.preventDefault();
    e.stopPropagation();

    // get index
    const index = steps.map((s) => s.toLowerCase()).indexOf(step);
    
    // update step
    setStep(steps[index - 1].toLowerCase());
  };

  // on continue
  const onContinue = (e) => {
    // prevent
    e.preventDefault();
    e.stopPropagation();

    // set state
    setStep(steps[steps.map(s => s.toLowerCase()).indexOf(step) + 1].toLowerCase());
  }

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
      user : auth && auth.exists() ? auth.user.get('_id') : null,
      payment,
      products,
      discount : page.cart.get('discount') ? page.cart.get('discount').get('_id') : null,
      shipping : {
        address : isBilling ? billing : shipping,
      },
      information : {
        user : auth && auth.exists() ? auth.user.get('_id') : null,
        email,
        address : billing,
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

    // loading discount
    setLoading('discount');

    // get code
    const code = discountRef.current?.value;

    // check code
    if (!code?.length) return;

    // check code
    let discount = props.dashup.page(page.get('data.discount.form')).where({
      [discountCodeField.name || discountCodeField.uuid] : code,
    });

    // uses
    if (discountUsesField) {
      discount = discount.gt(discountUsesField.name || discountUsesField.uuid, 0);
    }

    // find one
    discount = await discount.findOne();

    // set discount
    if (!discount) {
      // discount
      setLoading(null);
      setDiscountError('Code not found');

      // return
      return;
    }

    // set discount
    await page.code(discount);

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

  // set steps
  const steps = hasShipping() ? ['Cart', 'Information', 'Shipping', 'Payment'] : ['Cart', 'Information', 'Payment'];

  // return jsx
  return (
    <div className={ getClass('checkout', 'dashup-checkout row') }>
    
      { /* CHECKOUT MAIN */ }
      <div className={ getClass('checkoutMain', 'dashup-checkout-main col-lg-7 order-1 order-lg-0') }>
        { !!props.logo && (
          <div className={ getClass('checkoutLogo', 'dashup-checkout-logo text-center') }>
            <img src={ props.logo } className={ getClass('checkoutLogoImg', 'w-25 margin-auto') } />
          </div>
        ) }
      
        <div className={ getClass('checkoutSteps', 'dashup-checkout-logo text-center mt-3 mb-5') }>
          { steps.map((s, i) => {
            // return jsx
            return (
              <span key={ `step-${s}` } className={ step === s.toLowerCase() ? 'text-bold' : '' }>
                { s }
                { i < steps.length - 1 ? ' > ' : '' }
              </span>
            );
          }) }
        </div>

        { !!(shipping || billing) && (
          <>
            <div className="card">
              { !!billing && (
                <div className="card-header">
                  <div className="row">
                    <div className="col-5">
                      <b>
                        <small>
                          Bill to
                        </small>
                      </b>
                    </div>
                    <div className="col-7">
                      <small className="text-overflow">
                        { billing.formatted }
                      </small>
                    </div>
                  </div>
                </div>
              ) }
              { !!shipping || !!(isBilling && billing) && (
                <div className="card-header">
                  <div className="row">
                    <div className="col-5">
                      <b>
                        <small>
                          Ship to
                        </small>
                      </b>
                    </div>
                    <div className="col-7">
                      <small className="text-overflow">
                        { (isBilling ? billing : shipping).formatted }
                      </small>
                    </div>
                  </div>
                </div>
              ) }
            </div>

            <hr />
          </>
        ) }

        { !!error && (
          <div className={ getClass('checkoutAlert', 'dashup-checkout-alert alert alert-danger mb-4') }>
            { error }
          </div>
        ) }

        { /* CHECKOUT STEPS */ }
        
        { /* INFORMATION */ }
        { step === 'information' && (
          <div>
            <div className={ getClass('checkoutContact', 'dashup-contact') }>
              <label className={ getClass('checkoutContactTitle', 'text-large form-label') }>
                Contact
                { !props.email && !!(auth && !auth.exists()) && (
                  <a href="#!" className={ getClass('checkoutContactExtra', 'ms-auto') } onClick={ (e) => setLogin(true) }>
                    Login or Register
                  </a>
                ) }
              </label>
              <input className={ getClass('checkoutInput', 'form-control') } placeholder="Email" value={ email } readOnly={ (auth && auth.exists()) || props.email } type="email" onChange={ (e) => setEmail(e.target.value) } />
            </div>

            <hr />

            <dashup.View
              type="field"
              view="input"
              struct="address"

              field={ {
                label : 'Billing Address',
              } }
              page={ page }
              value={ billing }
              dashup={ dashup }
              onChange={ (f, value) => setBilling(value) }
            />
          </div>
        ) }

        { /* SHIPPING */ }
        { step === 'shipping' && hasShipping() && (
          <div>
            <div className="form-check me-sm-2">
              <input type="checkbox" className="form-check-input" id="shipping-is-billing" onChange={ (e) => setIsBilling(e.target.checked) } defaultChecked={ isBilling } />
              <label className="form-check-label" htmlFor="shipping-is-billing">
                Same as Billing
              </label>
            </div>
            
            { !isBilling && (
              <>
                <hr />

                <dashup.View
                  type="field"
                  view="input"
                  struct="address"

                  field={ {
                    label : 'Shipping Address',
                  } }
                  page={ page }
                  value={ shipping }
                  dashup={ dashup }
                  onChange={ (f, value) => setShipping(value) }
                />
              </>
            ) }
          </div>
        ) }
        
        { /* PAYMENT */ }
        { step === 'payment' && (
          <div>
            <div className="card mb-3">
              { (props.page.get('connects') || []).map((source, i) => {
                // return jsx
                return (
                  <div key={ `source-${i}` }>
                    <div className="card-header">
                      <div className="form-check">
                        <input type="radio" id={ source.uuid } name="payment-type" className="form-check-input" checked />
                        <label className="form-check-label" htmlFor={ source.uuid }>
                          { source.type }
                        </label>
                      </div>
                    </div>

                    <div className="card-body">
                      <dashup.View
                        type="connect"
                        view="pay"
                        struct={ source.type }
                        connect={ source }
                        
                        page={ page }
                        value={ shipping }
                        dashup={ dashup }
                        setPayment={ (v) => v ? setPayment({ type : source.type, uuid : source.uuid, value : v }) : setPayment(null) }
                      />
                    </div>
                  </div>
                );
              }) }
            </div>
          </div>
        ) }
        
        { /* ACTIONS */ }
        <div className={ getClass('checkoutComplete', 'dashup-checkout-complete row') }>
          <div className={ getClass('checkoutCompleteBack', 'col-6') }>
            { steps.map(s => s.toLowerCase()).indexOf(step) > 1 && (
              <button className={ getClass('checkoutCompleteBtn', 'btn btn-link ps-0 btn-lg') } onClick={ (e) => onBack(e) }>
                Back
              </button>
            ) }
            { !!props.back && steps.map(s => s.toLowerCase()).indexOf(step) === 1 && (
              <a href={ props.back } className={ getClass('checkoutCompleteBtn', 'btn btn-link ps-0 btn-lg') }>
                Back
              </a>
            ) }
          </div>
          <div className={ getClass('checkoutCompleteBtnWrap', 'col-6 text-end') }>
            { step !== 'payment' ? (
              <button className={ getClass('checkoutCompleteBtn', 'btn btn-primary btn-lg') } onClick={ (e) => onContinue(e) }>
                Continue
              </button>

            ) : (
              <button className={ `${getClass('checkoutCompleteBtn', 'btn btn-success btn-lg')} ${!!payment && !completing ? '' : 'disabled'}` } onClick={ (e) => onComplete(e) }>
                { completing ? 'Completing...' : 'Complete Order' }
              </button>
            ) }
          </div>
        </div>
        
        { /* / STEPS */ }
      </div>
      
      <div className={ getClass('checkoutSidebar', 'dashup-checkout-cart col-lg-5 order-0 order-lg-1') }>

        { /* CART */ }
        { (cart.get('products') || []).map((product, i) => {
          // return jsx
          return (
            <div key={ `product-${i}` } className={ getClass('cartItem', 'dashup-cart-item row mb-3') }>
              { !!getProduct(product, 'image.0.thumbs.2x-sq.url') && (
                <div className={ getClass('cartItemImage', 'col-4') }>
                  <img src={ getProduct(product, 'image.0.thumbs.2x-sq.url') } className={ getClass('cartItemImageImg', 'img-fluid') } />
                </div>
              ) }
              <div className={ getClass('cartItemInfo', 'col d-flex align-items-center') }>
                <div className="w-100">
                  <p className={ getClass('cartItemTitle', 'dashup-item-title') }>
                    <small>
                      { product.count.toLocaleString() }
                      <i className={ getClass('cartItemPriceSep', 'fal fa-times mx-1') } />
                    </small>
                    <b>{ getProduct(product, 'title') }</b>
                  </p>
                  <p className={ getClass('cartItemPrice', 'dashup-item-price') }>
                    <b>
                      ${ (getProduct(product, 'field.price') * product.count).toFixed(2) }
                    </b>
                    { getProduct(product, 'field.type') === 'subscription' && (
                      <small className={ getClass('cartItemPeriod', 'dashup-item-period ms-2') }>
                        { getProduct(product, 'field.period') || 'Monthly' }
                      </small>
                    ) }
                  </p>
                </div>
              </div>
            </div>
          )
        }) }

        <hr />

        { /* DISCOUNT */ }
        { !!props.page.get('data.discount.model') && (
          <div className={ getClass('checkoutDiscount', 'dashup-discount d-flex flex-row') }>
            <div className={ getClass('checkoutDiscountInputWrap', 'flex-1') }>
              <input className={ getClass('checkoutDiscountInput', 'form-control') } ref={ discountRef } placeholder="Discount code" />
            </div>
            <div className={ getClass('checkoutDiscountBtnWrap', 'flex-0 ms-3') }>
              <button className={ `${getClass('checkoutButton', 'btn btn-block btn-primary')}${loading === 'discount' ? ' disabled' : ''}` } onClick={ (e) => onDiscount(e) }>
                { loading === 'discount' ? 'Applying...' : 'Apply' }
              </button>
            </div>
          </div>
        ) }
        { !!cart.get('discount') && (
          <div className="mt-2 d-flex align-items-center">
            <b className="me-2">
              { getDiscount('code') }
            </b>
            { getDiscount('discount.type', 'amount') === 'amount' ? '$' : '' }{ parseFloat(getDiscount('discount.value')).toFixed(2) }{ getDiscount('discount.type', 'amount') === 'amount' ? '' : '%' }
            Off
            <button className={ `btn btn-sm btn-secondary ms-auto${loading === 'discount' ? ' disabled' : ''}` } onClick={ (e) => onRemoveDiscount(e) }>
              <i className={ loading === 'discount' ? 'fa fa-spinner fa-spin' : 'fa fa-times' } />
            </button>
          </div>
        ) }

        { !!props.page.get('data.discount.model') && (
          <hr />
        ) }

        { /* SUB TOTAL */ }
        <div className={ getClass('checkoutSubtotal', 'dashup-subtotal') }>
          { Object.entries(page.totals()).map((entry, i) => {
            // return jsx
            return (
              <div key={ `entry-${entry[0]}` } className={ getClass('checkoutSubtotalLine', 'row mb-2') }>
                <div className={ getClass('checkoutSubtotalLabel', 'col-8') }>
                  { entry[0] !== 'simple' ? `${entry[0].charAt(0).toUpperCase()}${entry[0].slice(1)}` : '' }
                </div>
                <div className={ getClass('checkoutSubtotalAmount', 'col-4 text-right')}>
                  <b>${ entry[1].toFixed(2) }</b>
                </div>
              </div>
            );
          }) }
          { !!page.discount(page.total()) && (
            <div className={ getClass('checkoutSubtotalLine', 'row mb-2') }>
              <div className={ getClass('checkoutSubtotalLabel', 'col-8') }>
                Discount
              </div>
              <div className={ getClass('checkoutSubtotalAmount', 'col-4 text-right')}>
                <b>${ page.discount().toFixed(2) }</b>
              </div>
            </div>
          ) }
          { !!page.get('data.order.shipping') && (
            <div className={ getClass('checkoutSubtotalLine', 'row mb-2') }>
              <div className={ getClass('checkoutSubtotalLabel', 'col-8') }>
                Shipping
              </div>
              <div className={ getClass('checkoutSubtotalAmount', 'col-4 text-right')}>
                { page.shipping() ? (
                  <b>${ page.shipping().toFixed(2) }</b>
                ) : (
                  <i>N/A</i>
                ) }
              </div>
            </div>
          ) }
        </div>

        <hr />

        { /* TOTAL */ }
        <div className={ getClass('checkoutTotal', 'dashup-total') }>
          <div className={ getClass('checkoutTotalLine', 'row mb-2') }>
            <div className={ getClass('checkoutTotalLabel', 'col-8 d-flex align-items-center') }>
              Total
            </div>
            <div className={ getClass('checkoutTotalAmount', 'col-4 text-right h4')}>
              ${ ((page.total() + page.shipping()) - page.discount(page.total())).toFixed(2) }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// export default
export default ShopCheckout;