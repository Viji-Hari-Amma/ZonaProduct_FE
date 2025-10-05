// hooks/useProtectedAddToCart.js
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from './useAuth';

export const useProtectedAddToCart = () => {
  const { isAuthenticated, addPendingCartItem } = useAuth();
  const navigate = useNavigate();

  const protectedAddToCart = useCallback((addToCartFunction, productId) => {
    if (!isAuthenticated) {
      // Store the product ID to add after login
      addPendingCartItem(productId);
      // Redirect to login page with return URL
      navigate('/Login', { 
        state: { 
          from: window.location.pathname,
          message: 'Please login to add items to your cart'
        }
      });
      return false;
    }
    
    // If authenticated, proceed with the add to cart function
    return addToCartFunction(productId);
  }, [isAuthenticated, addPendingCartItem, navigate]);

  return { protectedAddToCart };
};