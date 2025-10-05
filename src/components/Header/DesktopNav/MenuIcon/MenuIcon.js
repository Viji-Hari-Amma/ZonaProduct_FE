import React, { useState } from "react";
import { RiMenu4Fill } from "react-icons/ri";
import { MdClose } from "react-icons/md";
import { IoHomeOutline } from "react-icons/io5";
import { RiContactsLine } from "react-icons/ri";
import { BiCategoryAlt } from "react-icons/bi";
import { NavLink } from "react-router-dom";
import { PiListChecksDuotone } from "react-icons/pi";

export const MenuIcon = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLinkClick = () => {
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="relative z-50">
      {/* Toggle Icon with animation */}
      <div
        className="cursor-pointer text-black md:text-white transition duration-200 relative w-8 h-8 flex items-center justify-center"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {/* Hamburger Icon */}
        <span
          className={`absolute transition-all duration-500 ease-in-out
            ${
              menuOpen
                ? "opacity-0 rotate-45 scale-75"
                : "opacity-100 rotate-0 scale-100"
            }
          `}
        >
          <RiMenu4Fill size={32} />
        </span>
        {/* Close Icon */}
        <span
          className={`absolute transition-all duration-500 ease-in-out
            ${
              menuOpen
                ? "opacity-100 rotate-0 scale-100"
                : "opacity-0 -rotate-45 scale-75"
            }
          `}
        >
          <MdClose size={32} />
        </span>
      </div>

      {/* Orange Backdrop - Adjusted to not cover bottom nav on mobile */}
      <div
        className={`fixed inset-0 bg-orange-100/40 backdrop-blur-sm z-40 transition-all duration-700 ease-in-out
        ${menuOpen ? "opacity-100" : "opacity-0 pointer-events-none"}
        md:top-[11vh] md:h-[89vh] h-[90vh]`}
        onClick={() => setMenuOpen(false)}
      />

      {/* Side Menu - Adjusted to not cover bottom nav on mobile */}
      <div
        className={`fixed top-0 right-0 h-[90vh] w-[300px] bg-gradient-to-b from-orange-600 to-red-700 shadow-2xl z-40 p-6
        transform-gpu origin-top-right
        ${
          menuOpen
            ? "translate-x-0 translate-y-0 scale-100 rotate-0 opacity-100 skew-y-0 pointer-events-auto"
            : "translate-x-12 -translate-y-8 scale-75 rotate-2 opacity-0 skew-y-1 pointer-events-none"
        }
        md:top-[11vh] md:h-[89vh]`}
        style={{
          transition:
            "transform 0.7s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.7s ease-in-out, skew 0.5s ease-out",
          borderRadius: menuOpen ? "0px" : "30px 0 0 30px",
          transitionProperty: "transform, opacity, skew, border-radius",
        }}
      >
        <nav className="flex flex-col gap-3 text-lg mt-16 md:mt-0">
          {[
            { path: "/", label: "Home", icon: <IoHomeOutline size={22} /> },
            {
              path: "/products",
              label: "Products",
              icon: <BiCategoryAlt size={22} />,
            },
            {
              path: "/orders",
              label: "Orders",
              icon: <PiListChecksDuotone size={25} />,
            },
            // {
            //   path: "/about",
            //   label: "About Us",
            //   icon: <BsInfoCircle size={22} />,
            // },
            {
              path: "/contact",
              label: "Contact",
              icon: <RiContactsLine size={22} />,
            },
          ].map(({ path, label, icon }, idx) => (
            <NavLink
              key={path}
              to={path}
              onClick={handleLinkClick}
              className={({ isActive }) =>
                `w-full rounded-md transition duration-200 ${
                  isActive ? "bg-gray-200" : "hover:bg-gray-100"
                }`
              }
            >
              {({ isActive }) => (
                <div
                  className={`w-[150px] mx-auto items-center gap-3 px-4 py-2 transition-all duration-500 flex
                  ${
                    menuOpen
                      ? "opacity-100 translate-x-0 rotate-0"
                      : "opacity-0 -translate-x-8 -rotate-6"
                  }
                  ${
                    isActive
                      ? "text-orange-600 font-medium"
                      : "text-white hover:text-orange-500"
                  }`}
                  style={{
                    transitionDelay: menuOpen ? `${idx * 80 + 200}ms` : "0ms",
                  }}
                >
                  {icon}
                  <span>{label}</span>
                </div>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
};
