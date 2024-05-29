"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { v4 as uuidv4 } from 'uuid';

const Context = createContext();

export const StateContext = ({ children }) => {
  const [bagItems, setBagItems] = useState([]);
  const [selectedVariations, setSelectedVariations] = useState({});

  useEffect(() => {
    // Load bag items from localStorage on component mount
    const storedBagItems = JSON.parse(localStorage.getItem('bagItems')) || [];
    setBagItems(storedBagItems);
  }, []);

  const handleVariationSelect = (type, value, event) => {
    event.preventDefault(); // Prevent the default behavior of the event
    setSelectedVariations((prevVariations) => ({
      ...prevVariations,
      [type]: value,
    }));
  };

  const addToBag = (productId, product, variations) => {
    // Generate a unique ID for the item
    const id = `${productId}-${JSON.stringify(variations)}`;

    const productToAdd = {
      id,
      productId,
      name: product.name,
      price: product.price,
      images: product.images[0],
      isFreeShipping: product.isFreeShipping,
      isAvailableInGhana: product.isAvailableInGhana,
      moq: product.moq === 0 ? 1 : product.moq,
      variations,
      quantity: 1,
    };

    const existingProductIndex = bagItems.findIndex(
      (item) => item.id === id
    );

    if (existingProductIndex !== -1) {
      // If the same product with the same variations exists in the cart, update quantity
      const updatedBag = bagItems.map((bagItem, index) =>
        index === existingProductIndex
          ? {
              ...bagItem,
              quantity: bagItem.quantity + productToAdd.quantity,
            }
          : bagItem
      );
      setBagItems(updatedBag);
      localStorage.setItem('bagItems', JSON.stringify(updatedBag)); // Update localStorage
    } else {
      // If the product with variations is not in the cart, add it
      setBagItems([...bagItems, productToAdd]);
      localStorage.setItem('bagItems', JSON.stringify([...bagItems, productToAdd])); // Update localStorage
    }

    const selectedVariationsMessage = Object.entries(variations)
      .map(([type, value]) => `${type}: ${value}`)
      .join(", ");

    toast.success(
      `${product.name} (${selectedVariationsMessage}) added to the bag.`
    );

    // Reset selectedVariations after adding the product to the bag
    setSelectedVariations({});
  };

  const removeItem = (itemId) => {
    const updatedBag = bagItems.filter((item) => item.id !== itemId);
    setBagItems(updatedBag);
    localStorage.setItem('bagItems', JSON.stringify(updatedBag)); // Update localStorage

    toast.success(`Item removed from the bag.`);
  };

  const toggleCartItemQuantity = (id, value) => {
    const updatedBagItem = bagItems.map((item) => {
      if (item.id === id) {
        if (value === 'inc') {
          return {
            ...item,
            quantity: item.quantity + 1,
          };
        } else if (value === 'dec' && item.quantity > 1) {
          return {
            ...item,
            quantity: item.quantity - 1,
          };
        }
      }
      return item;
    });
  
    setBagItems(updatedBagItem);
  };
  

  const incQty = () => {
    setQty((prevQty) => prevQty + 1);
  };

  const decQty = () => {
    setQty((prevQty) => {
      if (prevQty - 1 < 1) return 1;
      return prevQty - 1;
    });
  };

  const getTotalQuantitiesInCart = () => {
    let q = 0;
    bagItems.map((item) => {
      if (item.hasOwnProperty("quantity")) {
        q += item.quantity;
      }
    });
    return q;
  };

  return (
    <Context.Provider
      value={{
        bagItems,
        setBagItems,
        addToBag,
        selectedVariations,
        setSelectedVariations,
        handleVariationSelect,
        removeItem,
        toggleCartItemQuantity,
        decQty,
        incQty,
        getTotalQuantitiesInCart
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useStateContext = () => {
  return useContext(Context);
};