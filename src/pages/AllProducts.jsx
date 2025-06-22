import React, { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import axios from "axios";
import { ConnectedProductCard } from "../components/ProductCard";
// import SideBar from "../components/SideBar/SideBar";
import FilterSidebar from "../components/SideBar/FilterSidebar";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import Breadcrumb from "../components/Breadcrumb/Breadcrumb";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";


const AllProducts = () => {
    const { i18n, t } = useTranslation();
    const isRTL = i18n.language === 'ar';
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Filter state
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedColors, setSelectedColors] = useState([]);
    const [selectedSizes, setSelectedSizes] = useState([]);
    const [priceRange, setPriceRange] = useState({ min: 0, max: 0, value: 0 });
    const [allCategories, setAllCategories] = useState([]);
    const [allColors, setAllColors] = useState([]);
    const [allSizes, setAllSizes] = useState([]);
    const [priceLimits, setPriceLimits] = useState({ min: 0, max: 0 });

    // Fetch products
    useEffect(() => {
        setLoading(true);
        axios.get('http://127.0.0.1:8000/api/v1/products')
            .then(res => {
                const products = res.data.data;
                setProducts(products);
                setFilteredProducts(products);
                // Extract filter options
                const categories = [];
                const colors = [];
                const sizes = [];
                let minPrice = null, maxPrice = null;
                products.forEach(p => {
                    // Categories
                    p.categories.forEach(cat => {
                        if (!categories.find(c => c.id === cat.id)) {
                            categories.push({ id: cat.id, label: cat.name, value: cat.id });
                        }
                    });
                    // Colors
                    p.colors.forEach(col => {
                        if (!colors.find(c => c.id === col.id)) {
                            colors.push({ id: col.id, label: col.name, value: col.id });
                        }
                    });
                    // Sizes
                    p.sizes.forEach(sz => {
                        if (!sizes.find(s => s.id === sz.id)) {
                            sizes.push({ id: sz.id, label: sz.name, value: sz.id });
                        }
                    });
                    // Price
                    const price = p.special_price ?? p.price;
                    if (minPrice === null || price < minPrice) minPrice = price;
                    if (maxPrice === null || price > maxPrice) maxPrice = price;
                });
                setAllCategories(categories);
                setAllColors(colors);
                setAllSizes(sizes);
                setPriceLimits({ min: Math.floor(minPrice), max: Math.ceil(maxPrice) });
                setPriceRange({ min: Math.floor(minPrice), max: Math.ceil(maxPrice), value: Math.ceil(maxPrice) });
                setLoading(false);
            })
            .catch(err => {
                setError('Failed to load products');
                setLoading(false);
            });
    }, []);

    // Filtering logic
    useEffect(() => {
        let filtered = products.filter(product => {
            // Category filter
            if (selectedCategories.length > 0) {
                const catIds = product.categories.map(c => c.id);
                if (!selectedCategories.some(id => catIds.includes(id))) return false;
            }
            // Color filter
            if (selectedColors.length > 0) {
                const colorHexes = product.colors.map(c => c.hex_code);
                if (!selectedColors.some(hex => colorHexes.includes(hex))) return false;
            }
            // Size filter
            if (selectedSizes.length > 0) {
                const sizeIds = product.sizes.map(s => s.id);
                if (!selectedSizes.some(id => sizeIds.includes(id))) return false;
            }
            // Price filter
            const price = product.special_price ?? product.price;
            if (price > priceRange.value) return false;
            return true;
        });
        setFilteredProducts(filtered);
    }, [products, selectedCategories, selectedColors, selectedSizes, priceRange]);

    // Sidebar sections
    const sections = [
        {
            key: 'categories',
            title: t('categories') || 'التصنيفات',
            type: 'checkbox',
            options: allCategories,
        },
        {
            key: 'colors',
            title: t('colors') || 'الألوان',
            type: 'color',
            options: allColors,
        },
        {
            key: 'sizes',
            title: t('sizes') || 'الأحجام',
            type: 'checkbox',
            options: allSizes,
        },
        {
            key: 'price',
            title: t('price') || 'السعر',
            type: 'price',
        },
    ];

    // Checkbox change handler
    const handleCheckboxChange = (sectionKey, value) => {
        if (sectionKey === 'categories') {
            setSelectedCategories(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]);
        } else if (sectionKey === 'sizes') {
            setSelectedSizes(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]);
        }
    };
    // Color select handler
    const handleColorSelect = (hex) => {
        setSelectedColors(prev => prev.includes(hex) ? prev.filter(v => v !== hex) : [...prev, hex]);
    };
    // Price change handler
    const handlePriceChange = (val) => {
        setPriceRange(pr => ({ ...pr, value: val }));
    };
    // Action (filter) button
    const handleFilterAction = () => {
        // No-op, filtering is live
    };

    // Handle toggling favorite status
    const handleToggleFavorite = async (productId) => {
        try {
            // Find the product in the state
            const product = products.find(p => p.id === productId);
            if (!product) return;
            
            // Determine if we're adding or removing from favorites
            const action = product.is_saved ? 'remove' : 'add';
            
            // Get the auth token from localStorage
            const token = localStorage.getItem('token');
            if (!token) {
                // If not logged in, redirect to login page
                toast.info(t('loginToSaveFavorites') || 'Please login to save favorites');
                // navigate('/login');
                return;
            }
            
            // Make API call to toggle favorite status
            const endpoint = `http://127.0.0.1:8000/api/v1/favorites/${action}`;
            const response = await axios.post(endpoint, 
                { product_id: productId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            if (response.status === 200) {
                // Update the product in state
                const updatedProducts = products.map(p => {
                    if (p.id === productId) {
                        return { ...p, is_saved: !p.is_saved };
                    }
                    return p;
                });
                
                setProducts(updatedProducts);
                
                // Also update filtered products
                const updatedFilteredProducts = filteredProducts.map(p => {
                    if (p.id === productId) {
                        return { ...p, is_saved: !p.is_saved };
                    }
                    return p;
                });
                
                setFilteredProducts(updatedFilteredProducts);
                
                // Show success message
                const message = action === 'add' ? 
                    (t('addedToFavorites') || 'Added to favorites') : 
                    (t('removedFromFavorites') || 'Removed from favorites');
                toast.success(message);
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
            toast.error(t('errorTogglingFavorite') || 'Error updating favorites');
        }
    };
    
    // Handle view product details
    const handleViewProductDetails = (productId) => {
        navigate(`/product/${productId}`);
    };

    // Selected checkboxes for sidebar
    const selectedCheckboxes = {
        ...Object.fromEntries(allCategories.map(cat => [cat.value, selectedCategories.includes(cat.value)])),
        ...Object.fromEntries(allSizes.map(sz => [sz.value, selectedSizes.includes(sz.value)])),
    };

    return (
        <>
            <Navbar />
            <Breadcrumb
                items={[t('home') || 'الرئيسية', t('allProducts') || 'كل المنتجات']}
                lang={i18n.language}
                
            />
            <div className={`all-products-container ${isRTL ? 'rtl' : 'ltr'} p-4`}>
                <div className="row">
                    <div className="col-md-3">
                        <FilterSidebar
                            isRTL={isRTL}
                            title={t('filterProducts') || 'تصفية المنتجات'}
                            sections={sections}
                            onCheckboxChange={handleCheckboxChange}
                            onColorSelect={handleColorSelect}
                            selectedCheckboxes={selectedCheckboxes}
                            selectedColors={selectedColors}
                            priceRange={priceRange}
                            onPriceChange={handlePriceChange}
                            actionLabel={t('filterProducts') || 'تصفية المنتجات'}
                            onAction={handleFilterAction}
                        />
                    </div>
                    <div className="col-md-9">
                        <h1 className="text-center mb-4">{t('allProducts') || 'كل المنتجات'}</h1>
                        {loading ? (
                            <div className="text-center py-5">{t('loading') || 'جاري التحميل...'}</div>
                        ) : error ? (
                            <div className="alert alert-danger">{error}</div>
                        ) : (
                            <div className="row">
                                {filteredProducts.length === 0 ? (
                                    <div className="text-center py-5">{t('noProductsFound') || 'لا توجد منتجات مطابقة'}</div>
                                ) : (
                                    filteredProducts.map((product) => (
                                        <div className="col-md-4 mb-4" key={product.id}>
                                            <ConnectedProductCard
                                                id={product.id}
                                                image={product.base_image || (product.images[0] && product.images[0].url) || '/assets/images/product_1.png'}
                                                name={i18n.language === 'ar' ? product.name : product.name_latin}
                                                latinName={product.name_latin}
                                                price={product.special_price ?? product.price}
                                                isFavorite={product.is_saved}
                                                onFavoriteClick={() => handleToggleFavorite(product.id)}
                                                onViewDetails={() => handleViewProductDetails(product.id)}
                                            />
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default AllProducts;