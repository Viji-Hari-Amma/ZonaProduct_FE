import React, { useEffect, useState } from "react";
import { IoHeartCircleOutline } from "react-icons/io5";
import { BsHandbag } from "react-icons/bs";
import { Link } from "react-router-dom";
import Logo from "../../../assets/images/Logo/logo3.png";
import { ProfileIcon } from "../ProfileIcon/ProfileIcon";
import { MenuIcon } from "./MenuIcon/MenuIcon";
import { InputSearch } from "./InputSearch/InputSearch";

import { useWishlist } from "../../../hooks/useWishlist";
import { useCart } from "../../../hooks/useCart";
import { getActiveLogo } from "../../../services/HomePage/HomePageAPI";

export const DesktopNav = () => {
  const [scrolled, setScrolled] = useState(false);
  const { wishlistItems } = useWishlist();
  const { cartCount } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [logoImage, setLogoImage] = useState(null);

  useEffect(() => {
    const fetchLogoImage = async () => {
      try {
        const response = await getActiveLogo();
        setLogoImage(response.data?.image_url || null);
      } catch (error) {
        console.error("Error fetching active logo:", error);
      }
    };
    fetchLogoImage();
  }, []);

  return (
    <div
      className={`w-full h-[11vh] backdrop-blur-sm text-center fixed top-0 left-0 z-50 border-b border-red-600 flex items-center justify-evenly px-4 shadow-sm transition-colors duration-300 ${
        scrolled
          ? "bg-gradient-to-r from-orange-500/80 to-red-600/80 backdrop-blur-md"
          : "bg-black/20"
      }`}
    >
      <div className="w-[30%]">
        <Link to="/" className="w-[160px]">
          <img
            src={logoImage || Logo}
            alt="Spice Arog Logo"
            className="w-[160px] h-[10vh]"
          />
        </Link>
      </div>

      <div className="w-[40%] flex items-center justify-end">
        <InputSearch />
      </div>

      <div className="flex items-center justify-end gap-6 w-[20%] min-w-[210px]">
        <div className="relative group">
          <Link to="/wishlist">
            <IoHeartCircleOutline
              size={32}
              className="text-white hover:scale-110 transition-transform duration-200"
            />
            {/* Wishlist Count Badge */}
            {wishlistItems.length > 0 && (
              <div className="absolute -top-2 -right-2 bg-[#DC2626] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-pulse">
                {wishlistItems.length > 99 ? "99+" : wishlistItems.length}
              </div>
            )}
          </Link>
          <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 bg-black text-white text-xs rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
            Wishlist
          </div>
        </div>

        <div className="relative group">
          <Link to="/cart">
            <BsHandbag
              size={28}
              className="text-white hover:scale-110 transition-transform duration-200"
            />
            {/* Cart Count Badge */}
            {cartCount > 0 && (
              <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-pulse">
                {cartCount > 99 ? "99+" : cartCount}
              </div>
            )}
          </Link>
          <div className="absolute -bottom-9 left-1/2 -translate-x-1/2 bg-black text-white text-xs rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
            Cart
          </div>
        </div>
        <ProfileIcon />
        <div>
          <MenuIcon />
        </div>
      </div>
    </div>
  );
};
