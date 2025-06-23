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
        <div className="product-card h-100 d-flex flex-column">
            <div className="card h-100 d-flex flex-column justify-content-between align-items-stretch">
                <div className="product-image-wrapper position-relative d-flex justify-content-center align-items-center p-3 bg-light rounded-top">
                    <img src={image} className="product-image card-img-top mx-auto d-block" alt={name} />
                    <button
                        className={`favorite-btn position-absolute top-0 start-0 m-1 ${isFavorite ? 'active' : ''}`}
                        onClick={onFavoriteClick}
                        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                        type="button"
                        style={{ zIndex: 2 }}
                    >
                        <img
                            src="/assets/images/favorite.svg"
                            alt="Favorite"
                            width="16"
                            height="15"
                        />
                    </button>
                </div>
                <div className="card-body d-flex flex-column flex-grow-1 justify-content-between p-3 gap-3">
                    <div className="w-100">
                        <h5 className="product-title card-title text-center mb-1" style={{ fontSize: '1rem', whiteSpace: 'nowrap', overflow: 'hidden' }}>{name}</h5>
                        <p className="product-subtitle card-subtitle text-center mb-2" style={{ fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden' }}>{latinName}</p>
                    </div>
                    <div className="d-flex justify-content-center align-items-center gap-2 mb-2">
                        <span className="product-price" style={{ fontSize: '1.1rem', fontWeight: 700 }}>{price}</span>
                        <span className="price-symbol d-flex align-items-center">
                            <img src="assets/images/sar.svg" className="price-symbol-img" alt="SAR" />
                        </span>
                    </div>
                    <div className="d-flex gap-2 mt-auto">
                        <button
                            className="btn btn-primary flex-grow-1 d-flex align-items-center justify-content-center"
                            onClick={onAddToCart}
                            aria-label="Add to cart"
                            disabled={loading}
                            type="button"
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
                            type="button"
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