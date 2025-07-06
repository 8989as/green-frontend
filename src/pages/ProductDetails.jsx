import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import Breadcrumb from "../components/Breadcrumb/Breadcrumb";
import AuthModal from "../components/Auth/AuthModal";
import { useCart } from '../contexts/CartContext.jsx';
import { useAuth } from '../contexts/AuthContext';
import { mockProducts } from '../data/mockData';
import { toast } from 'react-toastify';
import './ProductDetails.css';

const ProductDetails = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const { addToCart } = useCart();
  const { isAuthenticated, otpSent } = useAuth();
  const navigate = useNavigate();

  // State
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [plantingAssistance, setPlantingAssistance] = useState(false);

  // Breadcrumb items
  const breadcrumbItems = [
    { label: t('home'), url: '/' },
    { label: t('store'), url: '/products' },
    { label: product?.name || t('product'), url: `/product/${id}`, active: true }
  ];

  // Fetch product details from mock data
  useEffect(() => {
    setLoading(true);
    // Find product by id (id from params is string, mock id is number)
    const foundProduct = mockProducts.find(p => String(p.id) === String(id));
    if (foundProduct) {
      setProduct(foundProduct);
      setIsFavorite(foundProduct.is_saved || false);
      if (foundProduct.colors && foundProduct.colors.length > 0) {
        setSelectedColor(foundProduct.colors[0]);
      }
      if (foundProduct.sizes && foundProduct.sizes.length > 0) {
        setSelectedSize(foundProduct.sizes[0]);
      }
      setError(null);
    } else {
      setProduct(null);
      setError(t('productNotFound') || 'لم يتم العثور على المنتج');
    }
    setLoading(false);
  }, [id, t]);

  // Handle quantity change
  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  // Handle color selection
  const handleColorSelect = (color) => {
    setSelectedColor(color);
  };

  // Handle size selection
  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };

  // Handle favorite toggle (mock only)
  const toggleFavorite = () => {
    if (!isAuthenticated) {
      toast.error(t('pleaseLoginToSaveItems'), {
        position: isRTL ? "bottom-left" : "bottom-right",
        autoClose: 3000,
      });
      return;
    }
    setIsFavorite(prev => !prev);
    // In a real app, update favorite status in backend or context
  };

  // Handle image navigation
  const nextImage = () => {
    if (product && product.images && product.images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === product.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (product && product.images && product.images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? product.images.length - 1 : prev - 1
      );
    }
  };

  // Handle thumbnail click
  const selectImage = (index) => {
    setCurrentImageIndex(index);
  };

  // State for auth modal
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingCartAction, setPendingCartAction] = useState(null);

  // Handle add to cart
  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      // Store the pending cart action for after authentication
      setPendingCartAction('add');
      // Show auth modal instead of navigating away
      setShowAuthModal(true);
      return;
    }
    
    try {
      // Per Bagisto API, include product options as additional_info for configurable products
      const productOptions = {
        'product_id': id,
        'quantity': quantity,
      };

      // Add additional options if they exist
      if (selectedColor) {
        productOptions.super_attribute = {
          color: selectedColor.id
        };
      }

      if (selectedSize) {
        if (!productOptions.super_attribute) {
          productOptions.super_attribute = {};
        }
        productOptions.super_attribute.size = selectedSize.id;
      }

      // Add planting assistance as a custom option
      if (plantingAssistance) {
        productOptions.additional_info = {
          planting_assistance: true
        };
      }
      
      await addToCart(id, quantity, productOptions);
      toast.success(t('addedToCart'), {
        position: isRTL ? "bottom-left" : "bottom-right",
        autoClose: 3000,
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error(t('failedToAddToCart'), {
        position: isRTL ? "bottom-left" : "bottom-right", 
        autoClose: 3000,
      });
      console.error('Error adding to cart:', error);
    }
  };

  // Handle buy now
  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      // Store the pending cart action for after authentication
      setPendingCartAction('buy');
      // Show auth modal instead of navigating away
      setShowAuthModal(true);
      return;
    }
    
    try {
      // Per Bagisto API, include product options as additional_info for configurable products
      const productOptions = {
        'product_id': id,
        'quantity': quantity,
      };

      // Add additional options if they exist
      if (selectedColor) {
        productOptions.super_attribute = {
          color: selectedColor.id
        };
      }

      if (selectedSize) {
        if (!productOptions.super_attribute) {
          productOptions.super_attribute = {};
        }
        productOptions.super_attribute.size = selectedSize.id;
      }

      // Add planting assistance as a custom option
      if (plantingAssistance) {
        productOptions.additional_info = {
          planting_assistance: true
        };
      }
      
      await addToCart(id, quantity, productOptions);
      navigate('/checkout');
    } catch (error) {
      toast.error(t('failedToAddToCart'), {
        position: isRTL ? "bottom-left" : "bottom-right",
        autoClose: 3000,
      });
      console.error('Error processing checkout:', error);
    }
  };

  // Effect to handle successful login
  useEffect(() => {
    // If user becomes authenticated and there was a pending cart action
    if (isAuthenticated && pendingCartAction) {
      const executePendingAction = async () => {
        try {
          const productOptions = {
            quantity,
          };
  
          if (selectedColor) {
            productOptions.super_attribute = { color: selectedColor.id };
          }
  
          if (selectedSize) {
            if (!productOptions.super_attribute) {
              productOptions.super_attribute = {};
            }
            productOptions.super_attribute.size = selectedSize.id;
          }
  
          if (plantingAssistance) {
            productOptions.additional_info = { planting_assistance: true };
          }
          
          await addToCart(id, quantity, productOptions);
          
          if (pendingCartAction === 'buy') {
            navigate('/checkout');
          } else {
            toast.success(t('addedToCart'), {
              position: isRTL ? "bottom-left" : "bottom-right",
              autoClose: 3000,
            });
          }
        } catch (error) {
          console.error('Error executing pending cart action:', error);
        } finally {
          // Clear the pending action
          setPendingCartAction(null);
        }
      };
      
      executePendingAction();
    }
  }, [isAuthenticated, pendingCartAction]);

  // Loading state
  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="container mx-auto my-5 d-flex justify-content-center">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">{t('loading')}</span>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div>
        <Navbar />
        <div className="container mx-auto my-5">
          <div className="alert alert-danger" role="alert">
            {error || t('productNotFound')}
          </div>
          <Link to="/products" className="btn btn-success">
            {t('backToProducts')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`${isRTL ? 'rtl' : 'ltr'}`}>
      <Navbar />
      <div className="container my-4">
        <Breadcrumb items={breadcrumbItems} />
      </div>
      
      <div className="container mb-5">
        <div className="product-detail-container">
          {/* Right Column - Product Information */}
          <div className="product-info-column">
            <div className="product-header-section">
              <div className="product-category">
                <span className="category-label">{t('category') || 'الفئة'}:</span>
                <span className="category-name">
                  {product.categories && product.categories.length > 0 
                    ? product.categories.map(cat => cat.name).join(', ')
                    : t('uncategorized') || 'نباتات مٌزهرة'}
                </span>
              </div>
              <div className="product-title-section">
                <h1 className="product-title">
                  {product.name}{product.name_latin ? ` - ${product.name_latin}` : ''}
                </h1>
                
                <div className="free-shipping-badge">
                  <span>{t('freeShipping') || 'توصيل مجانى'}</span>
                  <div className="shipping-icon">
                    <img src="/assets/images/shipping-icon.svg" alt="Shipping" width="16" height="13" onError={(e) => e.target.style.display = 'none'} />
                  </div>
                </div>
              </div>
            </div>

            <div className="product-price">
              <span className="price-amount">
                {product.special_price ?? product.price}
              </span>
              <div className="currency-icon">
                <img src="/assets/images/sar.svg" alt="SAR" width="24" height="24" />
              </div>
            </div>

            <div className="payment-options">
              <div className="payment-option">
                <div className="option-icon"></div>
                <div className="payment-text">قسّمها على 4 دفعات بدون فوائد بقيمة 37.5 ريال/الشهر</div>
                <img className="payment-logo" src="https://placehold.co/60x26" alt="Tamara" />
              </div>
              <div className="payment-option">
                <div className="option-icon"></div>
                <div className="payment-text">قسّمها على 4 دفعات بدون فوائد بقيمة 37.5 ريال/الشهر</div>
                <img className="payment-logo" src="https://placehold.co/60x24" alt="Tabby" />
              </div>
            </div>

            <div className="product-description">
              <h2>{t('productDescription') || 'وصف النبات'}</h2>
              {/* Render HTML description safely */}
              <p dangerouslySetInnerHTML={{ __html: product.description }}></p>
            </div>

            {product.colors && product.colors.length > 0 && (
              <div className="color-options">
                <h2>{t('color') || 'اللون'}</h2>
                <div className="color-selection">
                  {product.colors.map((color) => {
                    // Use hex_code from mockData if available
                    const hexColor = color.hex_code || '#3D853C';
                    return (
                      <div 
                        key={color.id} 
                        onClick={() => handleColorSelect(color)}
                        className={`color-option ${selectedColor?.id === color.id ? 'selected' : ''}`}
                      >
                        <div className="color-swatch" style={{backgroundColor: hexColor}}></div>
                        <span>{color.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {product.sizes && product.sizes.length > 0 && (
              <div className="size-options">
                <h2>{t('size') || 'الحجم'}</h2>
                <div className="size-grid">
                  {product.sizes.map((size) => (
                    <div 
                      key={size.id} 
                      onClick={() => handleSizeSelect(size)}
                      className={`size-option ${selectedSize?.id === size.id ? 'selected' : ''}`}
                    >
                      <div className="size-detail">
                        <span className="size-label">{t('size') || 'المقاس'}:</span>
                        <span className="size-value">{size.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="quantity-selector">
              <h2>{t('quantity') || 'الكمية'}</h2>
              <div className="quantity-control">
                <div onClick={increaseQuantity} className="quantity-icon plus-icon"></div>
                <span className="quantity-value">{quantity}</span>
                <div onClick={decreaseQuantity} className="quantity-icon minus-icon"></div>
              </div>
            </div>

            <div className="planting-assistance">
              <div 
                className={`checkbox ${plantingAssistance ? 'checked' : ''}`} 
                onClick={() => setPlantingAssistance(!plantingAssistance)}
              ></div>
              <span>أريد شخص متخصص لمساعدتى في زراعة النبات عند التوصيل</span>
            </div>

            <div className="action-buttons">
              <button 
                onClick={handleBuyNow} 
                className="secondary-button"
              >
                <span>{t('buyNow') || 'إشترى الآن'}</span>
                <div className="button-icon right-arrow"></div>
              </button>
              <button 
                onClick={handleAddToCart} 
                className="primary-button"
              >
                <span>{t('addToCart') || 'إضافة إلى السلة'}</span>
                <div className="button-icon plus"></div>
              </button>
            </div>
          </div>

          {/* Left Column - Product Images */}
          <div className="product-images-column">
            <div className="main-product-image">
              <div className="product-image-container">
                <img 
                  className="product-image" 
                  src={product.images && product.images.length > 0 
                    ? product.images[currentImageIndex].large_image_url || product.images[currentImageIndex].url 
                    : 'https://placehold.co/471x400/green/white?text=Plant+Image'} 
                  alt={product.name} 
                />
                <button 
                  onClick={toggleFavorite} 
                  className="favorite-button"
                >
                  <img 
                    src="/assets/images/favorite.svg" 
                    alt="Favorite" 
                    className={`heart-icon ${isFavorite ? 'favorite' : ''}`}
                    width="16" 
                    height="15" 
                    style={{ filter: isFavorite ? 'none' : 'grayscale(100%)' }}
                  />
                </button>
              </div>
              <div className="image-navigation">
                <button onClick={prevImage} className="nav-button prev">
                  <img src="/assets/images/breadcrumb.svg" className="nav-icon left-arrow" alt="Previous" width="15" height="10" />
                </button>
                <button onClick={nextImage} className="nav-button next">
                  <img src="/assets/images/breadcrumb.svg" className="nav-icon right-arrow" alt="Next" width="15" height="10" />
                </button>
              </div>
            </div>

            <div className="thumbnail-gallery">
              {(product.images && product.images.length > 0 ? product.images : [1, 2, 3, 4]).map((image, index) => (
                <div 
                  key={typeof image === 'object' ? image.id : index} 
                  className={`thumbnail-container ${currentImageIndex === index ? 'selected' : ''}`}
                  onClick={() => selectImage(index)}
                >
                  <img 
                    className="thumbnail" 
                    src={typeof image === 'object' ? (image.medium_image_url || image.small_image_url || image.url) : `https://placehold.co/85x89/green/white?text=Thumb+${index + 1}`} 
                    alt={`${product?.name || 'Product'} - View ${index + 1}`} 
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />

      {/* Auth Modal with current product URL and pending action */}
      <AuthModal 
        show={showAuthModal}
        onHide={() => {
          if (!otpSent) {
            setShowAuthModal(false);
            if (!isAuthenticated) {
              setPendingCartAction(null);
            }
          }
        }}
        initialTab="login"
        returnUrl={`/product/${id}`}
      />
    </div>
  );
};

export default ProductDetails;