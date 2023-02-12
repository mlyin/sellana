import React, { useContext, useState, createContext } from 'react';

import { CartContext } from '../../hooks/cartContext'


export const Storefront = ({ items }) => {
  const {cartPrice, setCartPrice, cart, setCart} = useContext(CartContext)
  function getCartPrice(cart) {
    let total = 0
    for (let i = 0; i < cart.length; i++) {
      total += cart[i].price
    }
    return total
  }
  function updateCartAdd(item, price) {
    setCart([...cart, {item, price}])
    setCartPrice(getCartPrice(cart));
  }
  function updateCartRemove(item, price) {
    setCart(cart.filter(i => i.item !== item && i.price !== price))
    setCartPrice(getCartPrice(cart));

  }

  return (
      <div>
        <link
          rel="stylesheet"
          href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta.2/css/bootstrap.min.css"
        />
        <div className="container">
          <div className="row">
            {items.map((item, index) => (
              <div className="col">
                <div className="card" style={{ margin: "50px" }}>
                  <img className="card-img-top" src={item.image} alt="Card image cap" />
                  <div className="card-body">
                    <h5 className="card-title">{item.name} ({item.price} SOL)</h5>
                    <p className="card-text">{item.description}</p>
                    <div className="d-flex justify-content-between">
                      <a className="btn btn-primary" onClick={() => updateCartAdd(item.name, item.price)}>
                        Add to cart
                      </a>
                      <a className="btn btn-primary" onClick={() => updateCartRemove(item.name, item.price)}>
                        Remove
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="row mt-3">
            <div className="col">
              <h3>Cart total: {cartPrice} SOL</h3>
              {cart.map(item => (
                <div>
                  {item.item} {item.price}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
  );
};

export default Storefront;
