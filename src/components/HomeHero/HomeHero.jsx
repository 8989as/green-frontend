import React from 'react';
import ImageComponent from './ImageComponent';
import './HomeHero.css';

const HomeHero = () => {
    return (
        <div className="hero-container">
            <div className="hero-content">
                <div className="hero-text">
                    <h1 className="hero-title">
من قلب الرياض إلى كل أرجاء المملكة  نباتات تزدهر بالحُب والعناية                    </h1>
                    <p className="hero-description">
                        في مزارع ومشاتل مساراتكو، نقدم لك تشكيلة متميزة من نباتات الزينة، الداخلية والخارجية، مزروعة بأحدث التقنيات وتحت إشراف نخبة من الخبراء الزراعيين. نوصلك بالجمال الطبيعي، أينما كنت، بجودة لا تُضاهى وخدمة لا تُنسى.
                    </p>

                    <button className="hero-cta">تسوق الآن</button>
                </div>

                <div className="image">
                    <ImageComponent />
                </div>
                {/* <div className="hero-image-container">
                    <div className="hero-bg-pattern">
                        <img
                            src="/assets/images/pattern-bg.svg"
                            alt="Background pattern"
                            className="pattern-bg"
                        />
                    </div>
                    <div className="hero-main-content">
                        <img
                            src="/assets/images/hero-image.svg"
                            alt="Decorative plant"
                            className="hero-image"
                        />
                        <div className="hero-features">
                            <div className="feature-badge top">جودة ممتازة</div>
                            <div className="feature-badge right">توصيل سريع</div>
                            <div className="feature-badge left">خدمة ما بعد البيع</div>
                        </div>
                    </div>
                </div> */}
            </div>
        </div>
    );
};

export default HomeHero;