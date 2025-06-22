import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [recentlyUpdated, setRecentlyUpdated] = useState(false);
  const [cartSummary, setCartSummary] = useState({
    subtotal: 0,
    tax: 0,
    shipping: 0,
    discount: 0,
    total: 0
  });

  // Initialize or retrieve cart (authenticated users only)
  const initializeCart = async () => {
    // Only proceed if user is authenticated
    if (!isAuthenticated) {
      setCart(null);
      setCartItemCount(0);
      setCartSummary({
        subtotal: 0,
        tax: 0,
        shipping: 0,
        discount: 0,
        total: 0
      });
      return;
    }
    
    setLoading(true);
    try {
      // Use Bagisto API endpoint for customer cart
      const response = await api.get('/api/v1/customer/cart');
      updateCartData(response);
    } catch (err) {
      setError(err);
      console.error('Failed to initialize cart:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Helper function to update cart data consistently
  const updateCartData = (cartData) => {
    setCart(cartData);
    
    // Update cart item count
    const itemCount = cartData?.items?.length > 0 
      ? cartData.items.reduce((total, item) => total + item.quantity, 0) 
      : 0;
    setCartItemCount(itemCount);
    
    // Update cart summary using Bagisto API format
    setCartSummary({
      subtotal: cartData?.base_sub_total || 0,
      tax: cartData?.base_tax_total || 0,
      shipping: cartData?.base_shipping_total || 0,
      discount: cartData?.discount_amount || 0, // Note: In Bagisto API this is discount_amount not base_discount_amount
      total: cartData?.base_grand_total || 0
    });
    
    // Trigger animation
    setRecentlyUpdated(true);
    setTimeout(() => setRecentlyUpdated(false), 1000);
  };

  // Add item to cart
  const addToCart = async (productId, quantity, options = {}) => {
    // Require authentication
    if (!isAuthenticated) {
      // Return a specific error so components can identify auth issues
      return Promise.reject({
        type: 'AUTH_REQUIRED',
        message: 'Authentication required to add items to cart'
      });
    }
    
    setLoading(true);
    try {
      // Per Bagisto API documentation, endpoint is /api/v1/customer/cart/add/{productId}
      const payload = {
        product_id: productId,
         quantity: quantity,
        ...options
      };
      
      // Use Bagisto's specified endpoint format
      const response = await api.post(`/api/v1/customer/cart/add/${productId}`, payload);
      
      updateCartData(response);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add item to cart');
      console.error('Failed to add item to cart:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update item in cart
  const updateCartItem = async (itemId, quantity) => {
    // Require authentication
    if (!isAuthenticated) {
      toast.error('Please log in to update your cart');
      return Promise.reject(new Error('Authentication required'));
    }
    
    setLoading(true);
    try {
      // According to Bagisto API, update endpoint is /api/v1/customer/cart/update
      // with quantity data in request body
      const payload = {
        qty: {
          [itemId]: quantity
        }
      };
      
      // Use Bagisto API update endpoint
      const response = await api.put('/api/v1/customer/cart/update', payload);
      
      updateCartData(response);
      return response;
    } catch (err) {
      setError(err);
      console.error('Failed to update cart item:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Remove item from cart
  const removeCartItem = async (itemId) => {
    // Require authentication
    if (!isAuthenticated) {
      toast.error('Please log in to remove items from your cart');
      return Promise.reject(new Error('Authentication required'));
    }
    
    setLoading(true);
    try {
      // According to Bagisto API, removal endpoint is /api/v1/customer/cart/remove/{cartItemId}
      const response = await api.delete(`/api/v1/customer/cart/remove/${itemId}`);
      
      updateCartData(response);
      return response;
    } catch (err) {
      setError(err);
      console.error('Failed to remove cart item:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Apply coupon code to cart
  const applyCoupon = async (couponCode) => {
    // Require authentication
    if (!isAuthenticated) {
      toast.error('Please log in to apply a coupon');
      return Promise.reject(new Error('Authentication required'));
    }
    
    setLoading(true);
    try {
      // According to Bagisto API, coupon endpoint is /api/v1/customer/cart/coupon
      const response = await api.post('/api/v1/customer/cart/coupon', {
        code: couponCode
      });
      
      updateCartData(response);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to apply coupon');
      console.error('Failed to apply coupon:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Remove coupon from cart
  const removeCoupon = async () => {
    // Require authentication
    if (!isAuthenticated) {
      toast.error('Please log in to remove a coupon');
      return Promise.reject(new Error('Authentication required'));
    }
    
    setLoading(true);
    try {
      // According to Bagisto API, coupon removal endpoint is DELETE /api/v1/customer/cart/coupon
      const response = await api.delete('/api/v1/customer/cart/coupon');
      
      updateCartData(response);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove coupon');
      console.error('Failed to remove coupon:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Move item from cart to wishlist
  const moveToWishlist = async (cartItemId) => {
    // Require authentication
    if (!isAuthenticated) {
      toast.error('Please log in to move items to your wishlist');
      return Promise.reject(new Error('Authentication required'));
    }
    
    setLoading(true);
    try {
      // According to Bagisto API, endpoint is /api/v1/customer/cart/move-to-wishlist/{cartItemId}
      const response = await api.post(`/api/v1/customer/cart/move-to-wishlist/${cartItemId}`);
      
      // Refresh cart after moving item to wishlist
      await initializeCart();
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to move item to wishlist');
      console.error('Failed to move item to wishlist:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Clear entire cart
  const clearCart = async () => {
    // Require authentication
    if (!isAuthenticated) {
      toast.error('Please log in to clear your cart');
      return Promise.reject(new Error('Authentication required'));
    }
    
    setLoading(true);
    try {
      // According to Bagisto API, endpoint is DELETE /api/v1/customer/cart/remove
      const response = await api.delete('/api/v1/customer/cart/remove');
      
      updateCartData(response);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to clear cart');
      console.error('Failed to clear cart:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Check authentication status when it changes
  useEffect(() => {
    if (isAuthenticated) {
      initializeCart();
    } else {
      // Clear cart data when user logs out
      setCart(null);
      setCartItemCount(0);
      setCartSummary({
        subtotal: 0,
        tax: 0,
        shipping: 0,
        discount: 0,
        total: 0
      });
    }
  }, [isAuthenticated]);

  return (
    <CartContext.Provider value={{
      cart,
      loading,
      error,
      cartItemCount,
      cartSummary,
      addToCart,
      updateCartItem,
      removeCartItem,
      applyCoupon,
      removeCoupon,
      moveToWishlist,
      clearCart,
      initializeCart,
      recentlyUpdated,
      isAuthenticated
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

export default CartContext;