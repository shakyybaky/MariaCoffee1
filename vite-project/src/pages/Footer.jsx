import React from "react";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import "./Footer.css";

const Footer = () => (
  <footer className="footer">
    <div className="footer-content">
  
      <div className="footer-col">
        <div className="footer-logo">
          <img src="/src/img/mainlogo.png" alt="Nueva Vizcaya Logo" />
          <div>
            <h2 className="footer-title">Maria Coffee</h2>
          </div>
        </div>
        <p className="footer-desc">
         Something is Good to Happen
        </p>
        <div className="footer-social">
          <a href="https://www.facebook.com/mariacoffeeofficial" target="_blank" aria-label="Facebook"><FacebookIcon /></a>
          <a href="https://www.instagram.com/mariacoffeeofficial?utm_medium=copy_link&fbclid=IwY2xjawKeynZleHRuA2FlbQIxMABicmlkETFRS2ZWMzlkcWphT3F6YXNRAR4KHmAg1LYnlSUucVOSTHUwtmQzbpy7gSsIWXUgB-WyEnNmy7mIcNZUhUo0dA_aem_hiRXQtxKN0x8VCBnrJcfIw" target="_blank" aria-label="Instagram"><InstagramIcon /></a>
        </div>
      </div>
      {/* Quick Links */}
      <div className="footer-col">
        <h4>Quick Links</h4>
        <ul className="footer-links">
          <li><a href="#">Home</a></li>
          <li><a href="#">About</a></li>
          <li><a href="#">Menu</a></li>
          <li><a href="#">Location</a></li>
        </ul>
      </div>
      {/* Contact */}
      <div className="footer-col">
        <h4>Contact</h4>
        <ul className="footer-contact">
          <li>General Santos Street,Poblacion North</li>
          <li>Solano, Nueva Vizcaya,Philippines</li>
          <li>0945 816 7404</li>
          <li>MariaCoffee@gmail.com</li>
        </ul>
      </div>
      {/* Hours */}
      <div className="footer-col">
        <h4>Hours</h4>
        <ul className="footer-hours">
          <li>Monday - Sunday: 8:00 AM - 10:00 PM</li>
        </ul>
      </div>
    </div>
    <hr className="footer-divider" />
    <div className="footer-bottom">
      © 2025 Maria Coffee. All rights reserved.
    </div>
  </footer>
);

export default Footer;