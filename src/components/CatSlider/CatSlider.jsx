import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './CatSlider.css';

const staticCategories = [
  { id: 1, nameKey: 'summerPlants', iconSrc: 'assets/images/cat_1.svg' },
  { id: 2, nameKey: 'winterPlants', iconSrc: 'assets/images/cat_2.svg' },
  { id: 3, nameKey: 'floweringPlants', iconSrc: 'assets/images/cat_3.svg' },
  { id: 4, nameKey: 'outdoorPlants', iconSrc: 'assets/images/cat_4.svg' },
  { id: 5, nameKey: 'indoorPlants', iconSrc: 'assets/images/cat_5.svg' },
  { id: 6, nameKey: 'shrubs', iconSrc: 'assets/images/cat_6.svg' }
];

const CatSlider = () => {
  const { t, i18n } = useTranslation();
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const isRTL = i18n.language === 'ar' || i18n.dir() === 'rtl';

  const handleCategoryClick = (id) => {
    setSelectedCategoryId(id);
  };

  return (
    <div className={`container cat-slider-container ${isRTL ? 'rtl' : ''}`}>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
        <h2 className="section-title m-0">{t('plantCategories')}</h2>
      </div>

      <div className="row g-3">
        {staticCategories.map((category) => (
          <div className="col-6 col-sm-4 col-md-3 col-lg-2" key={category.id}>
            <div
              className={`category-card text-center p-3 h-100 ${
                selectedCategoryId === category.id ? 'selected' : ''
              }`}
              onClick={() => handleCategoryClick(category.id)}
            >
              <div className="icon-placeholder mb-2">
                <img
                  src={category.iconSrc}
                  alt={t(category.nameKey)}
                  className="img-fluid"
                />
              </div>
              <div className="category-name">{t(category.nameKey)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CatSlider;
