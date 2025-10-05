import React, { useEffect, useState } from "react";
import {
  FaChartLine,
  FaUsers,
  FaShoppingCart,
  FaPizzaSlice,
  FaCreditCard,
  FaTag,
  FaStar,
  FaQuestionCircle,
  FaHeadset,
  FaCog,
  FaTimes,
} from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import Logo from "../../../assets/images/Logo/logo3.png";
import { getActiveLogo } from "../../../services/HomePage/HomePageAPI";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  const location = useLocation(); // 👈 track current path
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

  const menuItems = [
    {
      group: "Main",
      items: [
        { icon: FaChartLine, label: "Dashboard", path: "/admin/dashboard" },
      ],
    },
    {
      group: "Management",
      items: [
        { icon: FaUsers, label: "Users", path: "/admin/User_Management" },
        {
          icon: FaShoppingCart,
          label: "Orders",
          path: "/admin/Order_Management",
        },
        {
          icon: FaPizzaSlice,
          label: "Products",
          path: "/admin/Product_Management",
        },
        {
          icon: FaCreditCard,
          label: "Payments",
          path: "/admin/Payment_Management",
        },
        { icon: FaTag, label: "Discount", path: "/admin/Discount_Management" },
      ],
    },
    {
      group: "Content",
      items: [
        { icon: FaStar, label: "Reviews", path: "/admin/Review_Management" },
        {
          icon: FaQuestionCircle,
          label: "FAQ's",
          path: "/admin/FAQ_Management",
        },
        {
          icon: FaHeadset,
          label: "Customer Support",
          path: "/admin/Contact_Management",
        },
        { icon: FaCog, label: "Website Settings", path: "/admin/Web_settings" },
      ],
    },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-primary-gradient overflow-y-scroll transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 lg:static lg:inset-0
      `}
      >
        <div className="flex items-center justify-between p-4 lg:justify-start">
          <div className="flex items-center justify-center w-full">
            <img
              src={logoImage || Logo}
              alt="Logo"
              className="w-[150px] h-[80px]"
            />
          </div>
          <button
            className="lg:hidden text-white"
            onClick={() => setIsOpen(false)}
          >
            <FaTimes />
          </button>
        </div>

        <nav className="mt-8">
          {menuItems.map((group, index) => (
            <div key={index} className="mb-6">
              <h3 className="px-6 text-xs uppercase tracking-wider text-navbar-hover font-medium mb-2">
                {group.group}
              </h3>
              <ul>
                {group.items.map((item, itemIndex) => {
                  const isActive = location.pathname === item.path; // 👈 check active
                  return (
                    <li key={itemIndex}>
                      <button
                        onClick={() => {
                          navigate(item.path);
                          setIsOpen(false); // close sidebar on mobile
                        }}
                        className={`
                          w-full flex items-center px-6 py-3 text-white transition-all duration-200
                          hover:bg-white hover:bg-opacity-10 border-l-4 border-transparent
                          ${
                            isActive
                              ? "bg-white bg-opacity-15 border-navbar-hover"
                              : ""
                          }
                        `}
                      >
                        <item.icon className="mr-3 text-lg" />
                        <span>{item.label}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
