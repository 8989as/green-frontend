import React from 'react';
import './FilterSidebar.css';

const FilterSidebar = ({
  isRTL = false,
  title = 'تصفية المنتاجات',
  sections = [],
  onCheckboxChange = () => {},
  onColorSelect = () => {},
  selectedCheckboxes = {},
  selectedColors = [],
  priceRange = null,
  onPriceChange = () => {},
  actionLabel = 'تصفية المنتاجات',
  onAction = () => {},
}) => {
  return (
    <div className={`filter-sidebar-container ${isRTL ? 'rtl' : 'ltr'} p-4`}> 
      <h3 className="filter-sidebar-title mb-4">{title}</h3>
      <div className="filter-sidebar-content d-flex flex-column gap-4">
        {sections.map((section, idx) => (
          <div className="filter-sidebar-section mb-4" key={section.title}>
            <h5 className="filter-sidebar-section-title mb-3">{section.title}</h5>
            {section.type === 'checkbox' && (
              <div className="filter-sidebar-options">
                {section.options.map((option) => (
                  <div key={option.value} className="form-check d-flex justify-content-between align-items-center py-2">
                    <label className="form-check-label filter-sidebar-checkbox-label flex-grow-1 text-end">{option.label}</label>
                    <input
                      type="checkbox"
                      className="form-check-input filter-sidebar-checkbox"
                      checked={!!selectedCheckboxes[option.value]}
                      onChange={() => onCheckboxChange(section.key, option.value)}
                      style={{ order: isRTL ? -1 : 1 }}
                    />
                  </div>
                ))}
              </div>
            )}
            {section.type === 'color' && (
              <div className="filter-sidebar-color-grid row g-2">
                {section.options.map((option, i) => (
                  <div key={option.value} className="col-6">
                    <button
                      className={`filter-sidebar-color-option d-flex align-items-center p-2${selectedColors.includes(option.value) ? ' selected' : ''}`}
                      style={{ backgroundColor: option.value, width: '100%' }}
                      onClick={() => onColorSelect(option.value)}
                      aria-label={option.label}
                    >
                      <span className="color-swatch me-2" style={{ backgroundColor: option.value }}></span>
                      <span className="filter-sidebar-color-label">{option.label}</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
            {section.type === 'price' && priceRange && (
              <div className="filter-sidebar-price-range d-flex align-items-center gap-2">
                <span className="filter-sidebar-price-label">{priceRange.min}</span>
                <input
                  type="range"
                  min={priceRange.min}
                  max={priceRange.max}
                  value={priceRange.value}
                  onChange={e => onPriceChange(Number(e.target.value))}
                  className="form-range filter-sidebar-price-slider flex-grow-1"
                />
                <span className="filter-sidebar-price-label">{priceRange.max}</span>
              </div>
            )}
          </div>
        ))}
        <button className="filter-sidebar-action-btn btn btn-success w-100 mt-3" onClick={onAction}>
          {actionLabel}
        </button>
      </div>
    </div>
  );
};

export default FilterSidebar;
