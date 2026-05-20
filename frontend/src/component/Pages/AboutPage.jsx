import React from 'react';
import './AboutPage.css';

export function AboutPage() {
  return (
    <div className="about-page-wrapper">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="container">
          <div className="about-hero-content">
            <span className="about-badge">Our Story</span>
            <h1 className="about-title">About E-GadgetHive</h1>
            <p className="about-subtitle">
              Empowering your digital lifestyle with authentic technology, modern solutions, and exceptional service.
            </p>
          </div>
        </div>
      </section>

      {/* Main Story Section */}
      <section className="about-story-section">
        <div className="container">
          <div className="story-grid">
            <div className="story-image-side">
              <div className="image-wrapper">
                <img 
                  src="https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=1200&auto=format&fit=crop" 
                  alt="Modern tech gadgets setup" 
                  className="story-main-img"
                />
                <div className="experience-badge">
                  <span className="exp-number">100%</span>
                  <span className="exp-text">Genuine & Trusted</span>
                </div>
              </div>
            </div>
            
            <div className="story-content-side">
              <h2 className="story-heading">Who We Are</h2>
              <div className="story-paragraphs">
                <p>
                  Welcome to <strong>E Gadget Hive</strong>, your trusted destination for the latest electronic gadgets and accessories. We are dedicated to providing high-quality products, modern technology solutions, and excellent customer service to tech lovers and everyday users.
                </p>
                <p>
                  At E Gadget Hive, we offer a wide range of electronic products including smartphones, laptops, smart watches, headphones, gaming accessories, and other digital gadgets at affordable prices. Our goal is to make technology easily accessible while ensuring customers receive genuine and reliable products.
                </p>
                <p>
                  We believe that technology should improve everyday life. Therefore, we continuously update our collection with the newest gadgets and trending electronic devices to meet customer needs and market demands.
                </p>
                <p>
                  Customer satisfaction is our top priority. Our team is committed to providing a smooth shopping experience, secure transactions, fast delivery services, and friendly support for every customer.
                </p>
                <p className="story-conclusion">
                  Whether you are looking for the latest gadgets for personal use, study, work, or entertainment, E Gadget Hive is here to help you discover the best technology products in one place.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="mission-vision-section">
        <div className="container">
          <div className="mv-grid">
            {/* Mission Card */}
            <div className="mv-card mission-card">
              <div className="mv-icon-wrapper">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <circle cx="12" cy="12" r="6"></circle>
                  <circle cx="12" cy="12" r="2"></circle>
                </svg>
              </div>
              <h3 className="mv-title">Our Mission</h3>
              <p className="mv-text">
                To provide innovative, affordable, and high-quality electronic gadgets while delivering excellent customer service and building long-term customer trust.
              </p>
              <div className="mv-card-glow"></div>
            </div>

            {/* Vision Card */}
            <div className="mv-card vision-card">
              <div className="mv-icon-wrapper">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              </div>
              <h3 className="mv-title">Our Vision</h3>
              <p className="mv-text">
                To become a leading and trusted online gadget store known for quality products, modern technology, and customer satisfaction.
              </p>
              <div className="mv-card-glow"></div>
            </div>
          </div>
        </div>
      </section>

      
     
    </div>
  );
}
