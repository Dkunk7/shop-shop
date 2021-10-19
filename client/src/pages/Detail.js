import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { useStoreContext } from "../utils/GlobalState";
import {
  REMOVE_FROM_CART,
  UPDATE_CART_QUANTITY,
  ADD_TO_CART,
  UPDATE_PRODUCTS,
} from '../utils/actions';
import Cart from '../components/Cart';
import { QUERY_PRODUCTS } from '../utils/queries';
import spinner from '../assets/spinner.gif';
import { idbPromise } from "../utils/helpers";

function Detail() {
  const [state, dispatch] = useStoreContext();
  const { id } = useParams();

  const [currentProduct, setCurrentProduct] = useState({}); // keep currentProduct in this component (and not globalize it) because it's the only place it gets used

  const { loading, data } = useQuery(QUERY_PRODUCTS);

  const { products, cart } = state

  useEffect(() => {
    // already in global store
    if (products.length) {
      setCurrentProduct(products.find((product) => product._id === id));
    } 
    // retrieved from server
    else if (data) { // if there's no product with an id that matches in the above statement, run dispatch to update the global state, which make useEffect run again and find the new data to match
      dispatch({
        type: UPDATE_PRODUCTS,
        products: data.products
      });

      data.products.forEach((product) => {
        idbPromise('products', 'put', product);
      });
    }
    // get cache from idb
    else if (!loading) {
      idbPromise('products', 'get').then((indexedProducts) => {
        dispatch({
          type: UPDATE_PRODUCTS,
          products: indexedProducts
        });
      });
    }
  }, [products, data, loading, dispatch, id]); // this second argument is called the dependency array

  const addToCart = () => {
    const itemInCart = cart.find((cartItem) => cartItem._id === id);
  
    if (itemInCart) {
      dispatch({
        type: UPDATE_CART_QUANTITY,
        _id: id,
        purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1
      });
      // if quantity is being updated, use existing item data and increment pruchaseQuantity value by one
      idbPromise('cart', 'put', {
        ...itemInCart,
        purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1
      });
    } else {
      dispatch({
        type: ADD_TO_CART,
        product: { ...currentProduct, purchaseQuantity: 1 }
      });
      // if product isn't in the car yet, add it to the current shopping cart in indexedDB
      idbPromise('cart', 'put', { ...currentProduct, purchaseQuantity: 1 });
    }
  };

  const removeFromCart = () => {
    dispatch({
      type: REMOVE_FROM_CART,
      _id: currentProduct._id
    });

    // upon removal from cart, delete the item from indexedDB using the 'currentProduct._id' to locate what to remove
    idbPromise('cart', 'delete', { ...currentProduct });
  };

  return (
    <>
      {currentProduct ? (
        <div className="container my-1">
          <Link to="/">← Back to Products</Link>

          <h2>{currentProduct.name}</h2>

          <p>{currentProduct.description}</p>

          <p>
            <strong>Price:</strong>${currentProduct.price}{' '}
            <button onClick = {addToCart}>Add to Cart</button>
            <button
              disabled = {!cart.find(p => p._id === currentProduct._id)}
              onClick = {removeFromCart}
            >
              Remove from Cart
            </button>
          </p>

          <img
            src={`/images/${currentProduct.image}`}
            alt={currentProduct.name}
          />
        </div>
      ) : null}
      {loading ? <img src={spinner} alt="loading" /> : null}
      <Cart />
    </>
  );
}

export default Detail;
