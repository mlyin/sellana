import React, { useState } from 'react';

const Storefront = ({items}) => {
  const [cart, setCart] = useState([]);

  const addToCart = (item, price) => {
    setCart([...cart, { item, price }]);
  };

  const removeFromCart = (item, price) => {
    setCart(cart.filter(i => i.item !== item && i.price !== price));
  };

  return (
    <>
      <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta.2/css/bootstrap.min.css"/>
      <div className="container">
        <div className="row">
          {items.map((item, index) => (
            <div className="col" key={index}>
              <div className="card" style={{margin: "50px"}}>
                <img className="card-img-top" src={item.image} alt="Card image cap" />
                <div className="card-header">
                  {item.name}
                </div>
                <div class="card-body">
                  <h5 class="card-title">{item.name}</h5>
                  <p class="card-text">{item.description}</p>
                  <div className="d-flex justify-content-between">
                    <a class="btn btn-primary" onClick={() => addToCart(item.name, item.price)}>+</a>
                    <a class="btn btn-primary" onClick={() => removeFromCart(item.name, item.price)}>-</a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}  

export default Storefront;
