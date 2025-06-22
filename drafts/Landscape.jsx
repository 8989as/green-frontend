import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import Breadcrumb from '../components/Breadcrumb/Breadcrumb';
import { LandscapeBookingForm } from '../components/LandscapeForm';
import '../components/Landscape.css';

function CategoryCard({ title, desc }) {
    return (
        <div className="categories-card d-flex flex-column align-items-center bg-custom-card rounded-4 p-4 gap-4">
            <div className="icon d-flex justify-content-center align-items-center w-100 mb-2">
                <svg width="91" height="104" viewBox="0 0 91 104" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="91" height="104" rx="0" fill="#A6C7A5" />
                </svg>
            </div>
            <div className="w-100 text-center">
                <div className="category-title fw-bold mb-2">{title}</div>
                <div className="category-desc">{desc}</div>
            </div>
        </div>
    );
}

const categories = {
    ar: [
        {
            title: 'ضمان رضا العملاء',
            desc: 'رضاك هو أولويتنا القصوى. نفتخر بجودة عملنا، وعدد كبير من عملائنا السعداء هو أكبر دليل على التميز والعناية التي نقدمها.'
        },
        {
            title: 'حلول متكاملة',
            desc: 'بدءًا من تصميم وتركيب الحدائق وصولاً إلى الصيانة الدورية والخدمات المتخصصة، نقدم مجموعة كاملة من خدمات تنسيق الحدائق.'
        },
        {
            title: 'خدمة مخصصة حسب احتياجاتك',
            desc: 'نؤمن أن كل حديقة فريدة من نوعها تمامًا كصاحبها. نأخذ الوقت الكافي لفهم رؤيتك وتفضيلاتك واحتياجاتك الخاصة.'
        },
        {
            title: 'الخبرة والتخصص',
            desc: 'على مدار سنوات من الخبرة العملية، يقدّم فريقنا من البستانيين ومصممي المناظر الطبيعية المحترفين ثروة من المعرفة لكل مشروع نقوم به.'
        }
    ],
    en: [
        {
            title: 'Customer Satisfaction Guarantee',
            desc: 'Your satisfaction is our highest priority. We take pride in our work, and our many happy clients are the greatest testament to the excellence and care we provide.'
        },
        {
            title: 'Integrated Solutions',
            desc: 'From garden design and installation to periodic maintenance and specialized services, we offer a complete range of landscaping services.'
        },
        {
            title: 'Customized Service to Your Needs',
            desc: 'We believe that each garden is as unique as its owner. We take the time to understand your vision, preferences, and specific needs.'
        },
        {
            title: 'Expertise and Specialization',
            desc: 'Over years of practical experience, our team of professional gardeners and landscape designers brings a wealth of knowledge to every project we undertake.'
        }
    ]
};

function Landscape() {
    const { t, i18n } = useTranslation();
    const [loading, setLoading] = useState(true);
    const [landscapeData, setLandscapeData] = useState([]);
    const [error, setError] = useState(null);
    const currentLang = i18n.language || 'en';
    const isRTL = currentLang === 'ar';

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/landscape');
                setLandscapeData(response.data.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch data: ' + err.message);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Helper function to split images into rows of 3
    const splitImagesIntoRows = (images) => {
        if (!images) return [];
        const rows = [];
        for (let i = 0; i < images.length; i += 3) {
            rows.push(images.slice(i, i + 3));
        }
        return rows;
    };

    // Find section by section ID
    const getSection = (sectionId) => {
        return landscapeData.find(item => item.section === sectionId);
    };

    const section1 = getSection('section1');
    const section2 = getSection('section2');
    const section3 = getSection('section3');

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <div className="spinner-border text-success" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return <div className="alert alert-danger m-5">{error}</div>;
    }

    return (
        <>
            <Navbar />
            <Breadcrumb
                page1={isRTL ? "الرئيسية" : "Home"}
                page2={isRTL ? "المنتجات" : "Products"}
                page3={isRTL ? "التفاصيل" : "Details"}
                separatorIcon="/assets/images/breadcrumb.svg"
                lang={currentLang}
            />
            <div className='container'>
                <div className={`frame1984078445 container-fluid py-5 ${isRTL ? 'rtl-root' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
                    <div className="d-flex flex-column gap-100 align-items-start">
                        {/* Top Section */}
                        <div className={`d-flex w-100 gap-3 mb-5 align-items-start ${!isRTL ? 'flex-row-reverse' : ''}`}>
                            <img
                                className="rounded-4 flex-shrink-0"
                                src={section1?.images?.[0] || "https://placehold.co/628x350"}
                                alt="main visual"
                                style={{ width: 628, height: 350, objectFit: 'cover' }}
                            />
                            <div className={`d-flex flex-column gap-3 ${isRTL ? 'align-items-end' : 'align-items-start'}`} style={{ width: 628 }}>
                                <div className={`main-title ${!isRTL ? 'text-start' : ''}`}>
                                    {isRTL ? section1?.title_ar || "شركة المسارات الرابحة شريكك الموثوق في تنسيق الحدائق"
                                        : section1?.title_en || "Masarat Company Your Trusted Partner in Landscaping"}
                                </div>
                                <div className={`main-desc ${!isRTL ? 'text-start' : ''}`}>
                                    {isRTL ? section1?.description_ar || "شركة المسارات الرابحة هي شركة سعودية متخصصة ورائدة في تصميم وتنفيذ وتوريد وصيانة أعمال تنسيق المواقع (اللاندسكيب) بمختلف أنواعها. نعمل على سد الفجوة في السوق من خلال تقديم حلول متكاملة تجمع بين الابتكار والجودة، ونهدف إلى تحقيق أعلى معايير الجمال والاستدامة في المساحات الخارجية، بما يتماشى مع تطلعات عملائنا ورؤية المملكة 2030."
                                        : section1?.description_en || "Masarat is a leading Saudi company specializing in the design, implementation, supply, and maintenance of landscape works of all kinds. We work to bridge the gap in the market by providing integrated solutions combining innovation and quality, and we aim to achieve the highest standards of beauty and sustainability in outdoor spaces, in line with our customers' aspirations and the Saudi Vision 2030."}
                                </div>
                            </div>
                        </div>

                        {/* Why Us Section */}
                        <div className={`d-flex flex-column gap-3 w-100 mb-5 ${isRTL ? 'align-items-end' : 'align-items-start'}`}>
                            <div className={`section-title ${!isRTL ? 'text-start' : ''}`}>
                                {isRTL ? "لماذا تختارنا !" : "Why Choose Us!"}
                            </div>
                            <div className="d-flex flex-row gap-3 w-100 justify-content-start align-items-center flex-wrap">
                                {categories[currentLang].map((cat, i) => (
                                    <CategoryCard key={i} title={cat.title} desc={cat.desc} />
                                ))}
                            </div>
                        </div>

                        {/* Previous Landscape Section */}
                        <div className='container'>
                            <div className={`section-title ${!isRTL ? 'text-start' : ''}`}>
                                {isRTL ? section3?.title_ar || "أعمال اللاندسكيب السابقة" : section3?.title_en || "Previous Landscape Works"}
                            </div>
                            <div className="container d-flex flex-column gap-2 w-100">
                                {section3 && splitImagesIntoRows(section3.images).map((row, i) => (
                                    <div className="row g-3" key={i}>
                                        {row.map((img, j) => (
                                            <div className="col-md-4" key={j}>
                                                <img
                                                    className="img-fluid rounded-4 w-100"
                                                    src={img}
                                                    alt="landscape"
                                                    style={{ height: 313, objectFit: 'cover' }}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className={`landscape-booking-form-container ${isRTL ? 'rtl' : 'ltr'}`}>
                    <LandscapeBookingForm lang={currentLang} />
                </div>
            </div>
            <Footer />
        </>
    );
}

export default Landscape;