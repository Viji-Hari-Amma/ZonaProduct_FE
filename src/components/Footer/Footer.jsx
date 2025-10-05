import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
} from "react-icons/fa";
import LogoImage from "../../assets/images/Logo/logo3.png";
import { aboutService } from "../../services/AboutPageApi/about";
import { toast } from "react-toastify";
import { getActiveLogo } from "../../services/HomePage/HomePageAPI";

const Footer = () => {
  const navigate = useNavigate();
  // Navigation handler
  const handleNavigation = (path) => {
    navigate(path);
  };

  const [CompanyDetails, setCompanyDetails] = useState({});
  const [SocialLinks, setSocialLinks] = useState({});
  const [LogoImageurl, setLogoImageurl] = useState();

  useEffect(() => {
    const fetchContactDetails = async () => {
      try {
        const response = await aboutService.getContactDetails();
        const SocialLinks = await aboutService.getSocialLinks();
        const Logo = await getActiveLogo();
        setCompanyDetails(response.data?.data);
        setSocialLinks(SocialLinks.data?.data);
        setLogoImageurl(Logo.data?.image_url);
      } catch (error) {
        toast.error("Failed to fetch contact details");
      }
    };
    fetchContactDetails();
  }, []);

  return (
    <footer className="bg-gradient-to-r from-[#F97316] to-[#DC2626] text-white relative overflow-hidden pt-12 pb-[13vh] xs:pb-6">
      <div className=" mx-auto px-4 relative z-10">
        <div className="flex flex-wrap justify-between mb-8">
          {/* Logo section */}
          <div className="w-full md:w-1/4 mb-8 md:mb-0 flex justify-center items-center">
            <div className="w-40 h-40 bg-white rounded-full flex items-center justify-center p-2 border-4 border-[#FED7AA] shadow-lg">
              {/* Logo Image */}
              <img
                src={LogoImageurl || LogoImage}
                alt="Logo"
                className="w-full h-full object-contain rounded-full"
              />
            </div>
          </div>

          {/* Quick Links */}
          <div className="w-1/2 max-w-375:w-full max-w-375:text-center md:w-1/6 mb-6 md:mb-0">
            <h3
              className="text-lg font-semibold mb-4 pb-2 text-white relative 
  after:absolute after:bottom-0 after:w-10 after:h-0.5 after:bg-[#FED7AA] 
  after:left-0 max-w-375:after:left-1/2 max-w-375:after:-translate-x-1/2"
            >
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => handleNavigation("/")}
                  className="text-[#FFE5E0] hover:text-white transition-all hover:translate-x-1 block w-full text-left"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation("/products")}
                  className="text-[#FFE5E0] hover:text-white transition-all hover:translate-x-1 block w-full text-left"
                >
                  Shop
                </button>
              </li>
              {/* <li>
                <button
                  onClick={() => handleNavigation("/about")}
                  className="text-[#FFE5E0] hover:text-white transition-all hover:translate-x-1 block w-full text-left"
                >
                  About Us
                </button>
              </li> */}
              <li>
                <button
                  onClick={() => handleNavigation("/orders")}
                  className="text-[#FFE5E0] hover:text-white transition-all hover:translate-x-1 block w-full text-left"
                >
                  Orders
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation("/contact")}
                  className="text-[#FFE5E0] hover:text-white transition-all hover:translate-x-1 block w-full text-left"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="w-1/2 max-w-375:w-full max-w-375:text-center md:w-[180px] mb-6 md:mb-0">
            <h3
              className="text-lg font-semibold mb-4 pb-2 text-white relative 
  after:absolute after:bottom-0 after:w-10 after:h-0.5 after:bg-[#FED7AA] 
  after:left-0 max-w-375:after:left-1/2 max-w-375:after:-translate-x-1/2"
            >
              Customer Service
            </h3>
            <ul className="space-y-2">
              {[
                { name: "FAQ", path: "/faq" },
                { name: "Shipping & Returns", path: "/shipping-returns" },
                // { name: "Order Tracking", path: "/order-tracking" },
                { name: "Privacy Policy", path: "/privacy-policy" },
                { name: "Terms & Conditions", path: "/terms-conditions" },
              ].map((item) => (
                <li key={item.name}>
                  <button
                    onClick={() => handleNavigation(item.path)}
                    className="text-[#FFE5E0] hover:text-white transition-all hover:translate-x-1 block w-full text-left"
                  >
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="w-full md:w-[230px] max-w-375:text-center">
            <h3
              className="text-lg font-semibold mb-4 pb-2 text-white relative 
  after:absolute after:bottom-0 after:w-10 after:h-0.5 after:bg-[#FED7AA] 
  after:left-0 max-w-375:after:left-1/2 max-w-375:after:-translate-x-1/2"
            >
              Contact Info
            </h3>
            <div className="space-y-3 text-[#FFE5E0] max-w-375:flex max-w-375:flex-col max-w-375:items-center">
              <p className="flex items-start max-w-375:justify-center">
                <FaMapMarkerAlt className="mt-1 mr-3 text-white" />
                <span>{CompanyDetails.address}</span>
              </p>
              <p className="flex items-center max-w-375:justify-center">
                <FaPhone className="mr-3 text-white" />
                <span>{CompanyDetails.phone_number}</span>
              </p>
              <p className="flex items-center max-w-375:justify-center">
                <FaEnvelope className="mr-3 text-white" />
                <span className="text-[15px]">{CompanyDetails.email}</span>
              </p>
            </div>

            {/* Social Media Links */}
            <div className="flex space-x-4 mt-6 justify-center md:justify-start">
              {SocialLinks && (
                <>
                  {SocialLinks.facebook_url && (
                    <button
                      onClick={() =>
                        window.open(SocialLinks.facebook_url, "_blank")
                      }
                      className="w-10 h-10 flex items-center justify-center bg-white rounded-full text-[#DC2626] hover:bg-[#FED7AA] transition-all hover:-translate-y-1"
                    >
                      <FaFacebookF />
                    </button>
                  )}
                  {SocialLinks.twitter_url && (
                    <button
                      onClick={() =>
                        window.open(SocialLinks.twitter_url, "_blank")
                      }
                      className="w-10 h-10 flex items-center justify-center bg-white rounded-full text-[#DC2626] hover:bg-[#FED7AA] transition-all hover:-translate-y-1"
                    >
                      <FaTwitter />
                    </button>
                  )}
                  {SocialLinks.instagram_url && (
                    <button
                      onClick={() =>
                        window.open(SocialLinks.instagram_url, "_blank")
                      }
                      className="w-10 h-10 flex items-center justify-center bg-white rounded-full text-[#DC2626] hover:bg-[#FED7AA] transition-all hover:-translate-y-1"
                    >
                      <FaInstagram />
                    </button>
                  )}
                  {SocialLinks.youtube_url && (
                    <button
                      onClick={() =>
                        window.open(SocialLinks.youtube_url, "_blank")
                      }
                      className="w-10 h-10 flex items-center justify-center bg-white rounded-full text-[#DC2626] hover:bg-[#FED7AA] transition-all hover:-translate-y-1"
                    >
                      <FaYoutube />
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[#FECACA] my-6"></div>

        {/* Footer bottom */}
        <div className="flex flex-col justify-center items-center">
          <p className="text-[#FFE5E0] text-sm text-center">
            © 2025 Spice Arog. All rights reserved. | Designed with 💜 by{" "}
            <a
              href="https://react-portfolio-new-y91w.onrender.com/#/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-[#FED7AA] transition-colors font-medium"
            >
              Hari haran
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
