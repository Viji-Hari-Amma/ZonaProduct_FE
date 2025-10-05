import React, { useRef, useEffect, useState } from "react";
import { FaUser, FaSignOutAlt, FaKey } from "react-icons/fa";
import Spinner from "../../Loader/Spinner";
import { useNavigate } from "react-router-dom";

export const UserDropdown = ({
  profilePic,
  handleProfileClick,
  handleLogout,
  loggingOut,
  profileLoading,
}) => {
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleChangePassword = () => {
    navigate("/Change-Password");
  };

  useEffect(() => {
    const handleClick = (event) => {
      if (
        !buttonRef.current?.contains(event.target) &&
        !dropdownRef.current?.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  const handleAction = (callback) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    callback(e);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="w-[35px] h-[35px] bg-white rounded-full border border-blue-500 flex items-center justify-center overflow-hidden text-white transition-transform duration-200 hover:scale-105 group"
      >
        {profileLoading ? (
          <Spinner size="w-12 h-12" color="border-blue-600"/>
        ) : profilePic ? (
          <img
            src={profilePic}
            alt="Profile"
            className="w-full h-full object-cover rounded-full group-hover:opacity-90 transition-opacity"
          />
        ) : (
          <FaUser className="text-xl group-hover:opacity-90" />
        )}
      </button>

      {isOpen && (
        <div
          ref={dropdownRef}
          className={`
            absolute left-[-75px] xs:right-0 xs:left-auto z-50 bg-white border border-gray-200 shadow-lg rounded-lg transition-all duration-200
            w-[200px]
            bottom-[50px] sm:top-[55px] sm:bottom-auto
          `}
          onClick={(e) => e.stopPropagation()}
        >
          <ul>
            {[
              {
                icon: <FaUser />,
                text: "View Profile",
                action: handleProfileClick,
              },
              {
                icon: <FaKey />,
                text: "Change Password",
                action: handleChangePassword,
              },
              {
                icon: loggingOut ? (
                  <Spinner size="w-12 h-12" color="border-green-600" />
                ) : (
                  <FaSignOutAlt />
                ),
                text: loggingOut ? "Logging out..." : "Logout",
                action: handleLogout,
                isDestructive: true,
              },
            ].map((item, index) => (
              <li key={index}>
                <button
                  onClick={handleAction(item.action)}
                  className={`p-3 flex items-center gap-3 w-full text-left hover:bg-gray-100 transition-all duration-200 group
                    ${
                      item.isDestructive
                        ? "text-red-500 hover:text-red-600"
                        : "text-gray-700 hover:text-gray-900"
                    }`}
                >
                  {React.cloneElement(item.icon, {
                    className: `text-sm ${
                      item.isDestructive
                        ? "text-red-500 group-hover:text-red-600"
                        : "text-gray-500 group-hover:text-gray-900"
                    }`,
                  })}
                  <span>{item.text}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
