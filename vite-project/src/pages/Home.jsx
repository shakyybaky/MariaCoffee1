import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from "./navbar.jsx";
import Footer from "./Footer.jsx";
import "./Navbar.css";
import "./Home.css";
import "./Footer.css";
import option2 from "../img/option2.jpg";
import BannerM from "../img/BannerM.png";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:1337/api/products")
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error("Failed to fetch products:", err));
  }, []);

  return (
    <div>
      <Navbar />
      {/* Landing Section */}
      <div className="landing-container">
        <img
          src={BannerM}
          alt="Maria Coffee Banner"
          className="banner-bg"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            objectFit: "cover",
            zIndex: -1,
          }}
        />
        <div className="home-buttons">
          <a href='#menu' className="btn btn-primary">View Menu</a>
          <a href='#findus' className="btn btn-outline">Find Us</a>
        </div>
      </div>

      {/* --- About Maria Coffee Section --- */}
      <section className="about-maria-section" id='about'>
        <div className="about-maria-flex">
          <img
            src={option2}
            alt="Maria Coffee Interior"
            className="about-maria-img"
          />
          <div className="about-maria-text">
            <h2 className="section-title"> ABOUT US</h2>
            <p className="section-description">
              Established in July 2021, Maria Coffee has been serving premium coffee and handcrafted gifts for over three years. The café is celebrated for its warm ambiance, exceptional service, and dedication to quality. Whether you're seeking a tranquil spot to enjoy your favorite brew or a place to connect with friends, Maria Coffee offers a welcoming environment for all.
            </p>
          </div>
        </div>
      </section>
      {/* --- Menu Section --- */}
      <section className="menu-maria-section" id='menu'>
        <div className="product-list">
          {products.length === 0 ? (
            <div>Loading menu...</div>
          ) : (
            products.map((product, idx) => (
              <div className="product-card" key={idx}>
                <img src={product.imageUrl ? `http://localhost:1337${product.imageUrl}` : ""} alt={product.name} />
                <div className="product-info">
                  <span className="product-name">{product.name}</span>
                  <span className="product-price">
                    ₱{Number(product.price).toFixed(2)}
                  </span>
                </div>
                <div className="product-description">
                  {product.description}
                </div>
              </div>
            ))
          )}
        </div>

        <div style={{ display: "flex", justifyContent: "center", marginTop: "-20px" }}>
          <Link to="/Menu" className="btn-primary" style={{ display: "inline-flex", alignItems: "center" }}>
            See Full Menu
            <ArrowForwardIcon style={{ fontSize: "20px", marginLeft: "6px" }} />
          </Link>
        </div>
      </section>

      {/* --- Find Us Section --- */}
      <section className="find-us-section" id='findus'>
        <h2 className="find-us-section-title"> FIND US</h2>
        <div className="find-us-content">
          <div className="find-us-map">
            <iframe
              title="Maria Coffee Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3821.227259807447!2d121.1799127!3d16.5186401!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x339041b6e298a5c7%3A0x98fbb12a5d4ff57!2sMaria%20Coffee!5e0!3m2!1sen!2sph!4v1716630000000!5m2!1sen!2sph"
              width="400"
              height="250"
              className="find-us-iframe"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
      {/* Footer Section */}
      <section id='footer'>
        <div className="footer-bg"></div>
        <Footer />
      </section>
    </div>
  );
}

export default Home;