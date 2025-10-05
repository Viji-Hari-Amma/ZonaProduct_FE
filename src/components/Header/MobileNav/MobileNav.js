import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { MenuIcon } from "../DesktopNav/MenuIcon/MenuIcon";
import { ProfileIcon } from "../ProfileIcon/ProfileIcon";
import { BsHandbag } from "react-icons/bs";
import { IoHeartCircleOutline, IoHomeOutline } from "react-icons/io5";
import { TopNav } from "./TopNav/TopNav";

import { useWishlist } from "../../../hooks/useWishlist";
import { useCart } from "../../../hooks/useCart";

export const MobileNav = () => {
  const location = useLocation();
  const isLoggedIn = Boolean(localStorage.getItem("accessToken"));
  const { wishlistItems } = useWishlist();
  const { cartCount } = useCart();

  const isProfileActive =
    (isLoggedIn && location.pathname.startsWith("/profile")) ||
    (!isLoggedIn && location.pathname === "/Login");

  const isMenuActive =
    location.pathname.startsWith("/product") ||
    location.pathname.startsWith("/about") ||
    location.pathname.startsWith("/contact") ||
    location.pathname.startsWith("/orders");

  const getNavStyles = (isActive) =>
    `flex flex-col gap-1 items-center justify-center h-[60px] w-[60px] rounded-full bg-white transition-all ${
      isActive ? "-mt-5" : ""
    }`;

  const getTextClass = (isActive) =>
    `text-xs font-medium ${isActive ? "text-orange-600" : "text-gray-500"}`;

  return (
    <>
      <TopNav />
      <div className="w-full flex items-center justify-between p-3 bg-white fixed bottom-0 h-[10vh] z-50">
        {/* Home */}
        <NavLink to="/" className={({ isActive }) => getNavStyles(isActive)}>
          <div className="h-[25px] flex items-center justify-center w-full">
            <IoHomeOutline size={28} className="p-1" />
          </div>
          <div>
            <h1 className={getTextClass(location.pathname === "/")}>Home</h1>
          </div>
        </NavLink>

        {/* Wishlist */}
        <NavLink
          to="/wishlist"
          className={({ isActive }) => getNavStyles(isActive)}
        >
          <div className="h-[25px] flex items-center justify-center w-full relative">
            <IoHeartCircleOutline size={28} className="text-red-500" />
            {/* Wishlist Count Badge */}
            {wishlistItems.length > 0 && (
              <div className="absolute -top-1 -right-1 bg-[#DC2626] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-pulse">
                {wishlistItems.length > 99 ? "99+" : wishlistItems.length}
              </div>
            )}
          </div>
          <div>
            <h1 className={getTextClass(location.pathname === "/wishlist")}>
              Wishlist
            </h1>
          </div>
        </NavLink>

        {/* Profile */}
        <div className={getNavStyles(isProfileActive)}>
          <div className="h-[35px] flex items-center justify-center w-full">
            <ProfileIcon />
          </div>
          <div>
            <h1
              className={getTextClass(
                isLoggedIn ? isProfileActive : location.pathname === "/Login"
              )}
            >
              {isLoggedIn ? "Profile" : "Login"}
            </h1>
          </div>
        </div>

        {/* Cart */}
        <NavLink
          to="/cart"
          className={({ isActive }) => getNavStyles(isActive)}
        >
          <div className="h-[25px] flex items-center justify-center w-full relative">
            <BsHandbag size={24} className="text-blue-500" />
            {/* Cart Count Badge */}
            {cartCount > 0 && (
              <div className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-pulse">
                {cartCount > 99 ? "99+" : cartCount}
              </div>
            )}
          </div>
          <div>
            <h1 className={getTextClass(location.pathname === "/cart")}>
              Cart
            </h1>
          </div>
        </NavLink>

        {/* Menu */}
        <div className={getNavStyles(isMenuActive)}>
          <div className="h-[25px] flex items-center justify-center w-full">
            <MenuIcon />
          </div>
          <div>
            <h1 className={getTextClass(isMenuActive)}>Menu</h1>
          </div>
        </div>
      </div>
    </>
  );
};
