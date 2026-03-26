import React from "react";
import "./Footer.css";
import { assets } from "../../assets/assets";
import { RiInstagramFill } from "react-icons/ri";
import { FaGithub } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <div className="footer" id="footer">
      <div className="footer-content">
        <div className="footer-content-left">
          <img src={assets.logo} alt="logo" className="logo" />
          <div className="footer-city">
            <h2>Currently Available in:</h2>
            <ul>
              <li>Egypt</li>
              <li>USA</li>
            </ul>
          </div>
        </div>
        <div className="footer-content-center">
          <h2>COMPANY</h2>
          <ul>
            <li>Home</li>
            <li>About Us</li>
            <li>Privacy Policy</li>
          </ul>
        </div>
        <div className="footer-content-right">
          <h2>Get in Touch</h2>
          <ul>
            <li>+20 1280656159</li>
            <a
              href="mailto:mohanadh002@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <li>mohanadh002@gmail.com</li>
            </a>

            <div className="social">
              <a
                href=""
                target="_blank"
                rel="noopener noreferrer"
              >
                <RiInstagramFill fontSize="1.75em" />
              </a>
              <a
                href="https://github.com/MohanadHesham98"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaGithub fontSize="1.75em" />
              </a>
              <a
                href=""
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaTwitter fontSize="1.75em" />
              </a>
            </div>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Footer;
