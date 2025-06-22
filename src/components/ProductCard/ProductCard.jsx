import './ProductCard.css';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faEye, faSpinner } from '@fortawesome/free-solid-svg-icons';

const ProductCard = ({
    image,
    name,
    latinName,
    price,
    isFavorite = false,
    onFavoriteClick,
    onAddToCart,
    onViewDetails,
    loading = false
}) => {
    const { t, i18n } = useTranslation();
    return (
        <div className="product-card">
            <div className="card h-100">
                <div className="product-image-wrapper">
                    <img src={image} className="product-image" alt={name} />
                    <button
                        className={`favorite-btn ${isFavorite ? 'active' : ''}`}
                        onClick={onFavoriteClick}
                        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                    >
                        <svg width="50" height="50" viewBox="0 0 36 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="36" height="35" rx="5" fill="#F8FFF8" />
                            <path d="M18.6693 10.7672C19.8867 9.94191 21.7657 9.53146 23.8453 10.8499L23.9871 10.9445C25.4321 11.9501 26.2333 13.9272 25.9399 16.1886C25.645 18.4606 24.2573 21.0209 21.3431 23.3421L21.056 23.566C19.9321 24.4258 19.2114 25 18 25C16.94 25 16.2556 24.5606 15.348 23.8747L14.944 23.566C11.8336 21.1864 10.3645 18.534 10.0601 16.1886C9.75724 13.8544 10.6207 11.8224 12.1547 10.8499L12.3618 10.7237C14.4965 9.47877 16.4007 10.0337 17.5654 10.9377L17.8437 11.1518C17.9038 11.1974 17.9556 11.2341 18 11.2653C18.101 11.1943 18.2374 11.0908 18.4346 10.9377L18.6693 10.7672ZM23.2618 11.8339C21.5998 10.7802 20.1834 11.1175 19.2791 11.7333L19.1047 11.8602C18.8969 12.0215 18.7188 12.1602 18.577 12.2561C18.5052 12.3047 18.4256 12.3542 18.343 12.3928C18.2647 12.4294 18.1442 12.4754 18 12.4754C17.8558 12.4754 17.7353 12.4294 17.657 12.3928C17.5744 12.3542 17.4948 12.3047 17.423 12.2561C17.3521 12.2081 17.2721 12.1494 17.1838 12.0826L16.8953 11.8602C16.0327 11.1906 14.6036 10.7381 12.9032 11.7325L12.7382 11.8339C11.6531 12.5219 10.9106 14.0598 11.167 16.0353C11.4219 17.9996 12.6775 20.3969 15.6082 22.639L16.0167 22.9493C16.8985 23.6114 17.3132 23.8462 18 23.8462C18.7848 23.8462 19.2145 23.5397 20.3918 22.639L20.6621 22.4279C23.4003 20.2471 24.586 17.9381 24.833 16.0353C25.0733 14.1832 24.4357 12.716 23.4609 11.9729L23.2618 11.8339Z" fill="#FB6487" />
                        </svg>
                    </button>
                </div>

                <div className="card-body d-flex flex-column gap-4">
                    <div className="d-flex justify-content-between align-items-start">

                        <div className="text-end">
                            <h5 className="product-title mb-1">{(i18n.language === 'ar' ? name : name)}</h5>
                            <p className="product-subtitle mb-0">{latinName}</p>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                            <div className="product-price">{price}</div>
                            <div className="price-symbol">
                                <img src="assets/images/sar.svg" className="price-symbol-img" alt="" />
                            </div>
                        </div>
                    </div>

                    <div className="d-flex gap-2">
                        <button
                            className="btn btn-primary flex-grow-1 d-flex align-items-center justify-content-center"
                            onClick={onAddToCart}
                            aria-label="Add to cart"
                            disabled={loading}
                        >
                            {loading ? (
                                <FontAwesomeIcon icon={faSpinner} spin />
                            ) : (
                                <FontAwesomeIcon icon={faShoppingCart} />
                            )}
                        </button>
                        <button
                            className="btn btn-outline-primary flex-grow-1 d-flex align-items-center justify-content-center"
                            onClick={onViewDetails}
                            aria-label="View details"
                        >
                            <FontAwesomeIcon icon={faEye} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

ProductCard.propTypes = {
    image: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    latinName: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    isFavorite: PropTypes.bool,
    onFavoriteClick: PropTypes.func.isRequired,
    onAddToCart: PropTypes.func.isRequired,
    onViewDetails: PropTypes.func.isRequired,
    loading: PropTypes.bool
};

export default ProductCard;