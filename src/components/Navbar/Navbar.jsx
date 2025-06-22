import React from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
  faHeart,
  faShoppingCart,
  faList,
  faLanguage
} from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.rtl.min.css';
import './Navbar.css';
import './CartBadge.css';
import { useCart } from '../../contexts/CartContext.jsx';
import NavAuthButtons from '../Auth/NavAuthButtons.jsx';

// Add icons to library
library.add(faSearch, faHeart, faShoppingCart, faList, faLanguage);

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const { cartItemCount, recentlyUpdated } = useCart();
  const [animateCart, setAnimateCart] = React.useState(false);

  // Add animation when cart updates
  React.useEffect(() => {
    if (recentlyUpdated) {
      setAnimateCart(true);
      const timeout = setTimeout(() => {
        setAnimateCart(false);
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [recentlyUpdated]);

  const toggleLanguage = () => {
    const newLang = isRTL ? 'en' : 'ar';
    i18n.changeLanguage(newLang);
    document.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    // Dynamically load the appropriate Bootstrap CSS
    const linkId = 'bootstrap-css';
    let link = document.getElementById(linkId);
    if (!link) {
      link = document.createElement('link');
      link.id = linkId;
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
    link.href = newLang === 'ar'
      ? 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.rtl.min.css'
      : 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css';
  };

  const menuItems = [
    { id: 'home', label: t('home'), isActive: true },
    { id: 'store', label: t('store') },
    { id: 'about', label: t('about') },
    { id: 'landscaping', label: t('landscaping') },
    { id: 'contact', label: t('contact') }
  ];

  // Reverse menu items for LTR
  const displayedMenuItems = isRTL ? menuItems : [...menuItems].reverse();

  const categories = [
    { id: 'summerPlants', label: t('summerPlants') },
    { id: 'winterPlants', label: t('winterPlants') },
    { id: 'naturalGrass', label: t('naturalGrass') },
    { id: 'trees', label: t('trees') },
  ];

  // Reverse categories for LTR
  const displayedCategories = isRTL ? categories : [...categories].reverse();

  return (
    <div className={`Frame117 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="Frame116">
        <div className="Frame115">
          <div className={`Frame114 ${isRTL ? 'order-1' : 'order-2'}`}>
            <NavLink to="/" className="MasaratcoLogo1-link">
              <img
                className="MasaratcoLogo1"
                src="assets/images/logo.svg"
                alt="Masaratco Logo"
              />
            </NavLink>
            <div className="Frame22">
              <NavLink to="/" className={({ isActive }) => `menu-link${isActive ? ' active' : ''}`}>{t('home')}</NavLink>
              <NavLink to="/products" className={({ isActive }) => `menu-link${isActive ? ' active' : ''}`}>{t('store')}</NavLink>
              <NavLink to="/landscape" className={({ isActive }) => `menu-link${isActive ? ' active' : ''}`}>{t('landscaping')}</NavLink>
              <NavLink to="/about" className={({ isActive }) => `menu-link${isActive ? ' active' : ''}`}>{t('about')}</NavLink>
              <NavLink to="/contact" className={({ isActive }) => `menu-link${isActive ? ' active' : ''}`}>{t('contact')}</NavLink>
            </div>
          </div>
          <div className={`Frame113 ${isRTL ? 'order-1' : 'order-2'}`}>
            {/* <div className="Frame23">
              <FontAwesomeIcon icon={faSearch} className="search-icon" />
              <input
                type="text"
                placeholder={t('search')}
                className="search-input"
                style={{ textAlign: isRTL ? 'right' : 'left' }}
              />
            </div> */}
            <div className="Frame112">
              {/* <NavLink to="/profile" className="icon-frame">
                <img src="assets/images/navProfile.svg" alt="Profile" />
              </NavLink> */}
              <NavLink to="/cart" className="icon-frame cart-icon-wrapper">
                {/* <FontAwesomeIcon icon={faShoppingCart} className="icon-vector" />
                 */}
                 <img src="assets/images/navCart.svg" alt="cart" />
                {cartItemCount > 0 && (
                  <span className={`cart-badge ${animateCart ? 'animated' : ''}`}>{cartItemCount}</span>
                )}
              </NavLink>
              <NavLink to="/wishlist" className="icon-frame">
                {/* <FontAwesomeIcon icon={faHeart} className="icon-vector" /> */}
                <img src="assets/images/navFavorite.svg" alt="fav" />
              </NavLink>
              <NavAuthButtons />
              <button className="icon-frame" onClick={toggleLanguage}>
                {/* <FontAwesomeIcon icon={faLanguage} className="icon-vector" /> */}
                <img src="assets/images/lang.svg" alt="" />
              </button>
            </div>
          </div>

        </div>

        <div className="Frame31">

          <div className={`categories-wrapper ${isRTL ? 'rtl' : 'ltr'}`}>
            <div className="Frame24">
              <img
                className="categories-icon"
                src="assets/images/cat_icon.svg"
                alt="Categories Icon"
              />
              <div className="categories-label">{t('categories')}</div>
            </div>
            {displayedCategories.map((category) => (
              <div key={category.id} className="category-frame">
                <div className="category-text">
                  {category.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;