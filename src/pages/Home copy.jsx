import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HomeHero from '../components/Hero';
import CatSlider from '../components/CatSlider';
import ProductCard from '../components/ProductCard/ProductCard';

import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';

const Home = () => {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('https://api.example.com/products');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }
    , []);
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