import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import HomeHero from '../components/HomeHero/HomeHero';
import CatSlider from '../components/CatSlider/CatSlider';
import ProductCard from '../components/ProductCard/ProductCard';

import { useTranslation } from 'react-i18next';

const Home = () => {
    const { t } = useTranslation();
    const products = [
        {
            id: 1,
            image: 'assets/images/product_1.png',
            nameAr: 'منتج 1',
            nameEn: 'Product 1',
            latinName: 'Productus 1',
            price: 100
        },
        {
            id: 2,
            image: 'assets/images/product_1.png',
            nameAr: 'منتج 2',
            nameEn: 'Product 2',
            latinName: 'Productus 2',
            price: 200
        },
        {
            id: 3,
            image: 'assets/images/product_1.png',
            nameAr: 'منتج 3',
            nameEn: 'Product 3',
            latinName: 'Productus 3',
            price: 300
        },
        {
            id: 4,
            image: 'assets/images/product_1.png',
            nameAr: 'منتج 4',
            nameEn: 'Product 4',
            latinName: 'Productus 4',
            price: 400
        },
        {
            id: 5,
            image: 'assets/images/product_1.png',
            nameAr: 'منتج 5',
            nameEn: 'Product 5',
            latinName: 'Productus 5',
            price: 500
        },
        {
            id: 6,
            image: 'assets/images/product_1.png',
            nameAr: 'منتج 6',
            nameEn: 'Product 6',
            latinName: 'Productus 6',
            price: 600
        }
    ];

    // Define missing states
    const [favorites, setFavorites] = useState([]);
    const loading = false; // Since products are hardcoded, no loading state
    const error = null;    // Since products are hardcoded, no error state
    return (
        <div>   
            <Navbar />
            <HomeHero />
            <CatSlider />
            <div className="container my-5">
                <h2 className="text-center mb-4">{t('home.featuredProducts')}</h2>
                {loading ? (
                    <div className="text-center">Loading...</div>
                ) : error ? (
                    <div className="text-center text-danger">{error}</div>
                ) : (
                    <div className="row">
                        {products.map((product) => (
                            <div className="col-md-4 mb-4" key={product.id}>
                                <ProductCard
                                    image={product.image}
                                    nameAr={product.nameAr}
                                    nameEn={product.nameEn}
                                    latinName={product.latinName}
                                    price={product.price}
                                    isFavorite={favorites.includes(product.id)}
                                    onFavoriteClick={() => {
                                        setFavorites((prev) =>
                                            prev.includes(product.id)
                                                ? prev.filter((id) => id !== product.id)
                                                : [...prev, product.id]
                                        );
                                    }}
                                    onAddToCart={() => console.log(`Add ${product.nameEn} to cart`)}
                                    onViewDetails={() => console.log(`View details for ${product.nameEn}`)}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default Home;