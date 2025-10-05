import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserDropdown } from "../UserDropDown/UserDropdown";
import { toast } from "react-toastify";
import axiosInstance from "../../../utils/axiosInstance";
import { getProfile } from "../../../services/profileApi/profileApi";
import { logoutUser } from "../../../services/AuthService/AuthService";
import { RiLoginCircleLine } from "react-icons/ri";
import useAuth from "../../../hooks/useAuth";
import Preloader from "../../Loader/Preloader";

export const ProfileIcon = () => {
  const navigate = useNavigate();
  const { logout, loginSuccessFlag, isAuthenticated, user, updateProfilePic } =
    useAuth();
  const [profileLoading, setProfileLoading] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const checkAuth = useCallback(async () => {
    try {
      setProfileLoading(true);
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) throw new Error("No token");

      await axiosInstance.get("/Auth/verify/");
      const userId = localStorage.getItem("userId");
      if (!userId) throw new Error("No user ID");

      const profileData = await getProfile(userId);
      const updatedPic = profileData.data.profile_picture_url || null;
      updateProfilePic(updatedPic);
    } catch (err) {
      console.error("Auth check failed:", err);
      updateProfilePic(null);
    } finally {
      setProfileLoading(false);
    }
  }, [updateProfilePic]);

  useEffect(() => {
    if (isAuthenticated) {
      checkAuth();
    }
  }, [isAuthenticated, loginSuccessFlag, checkAuth]);

  // Initial load - check if user is logged in
  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      checkAuth();
    }
  }, [checkAuth]);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        await logoutUser({ refresh: refreshToken });
        toast.success("Logged out successfully");
      }
    } catch {
      toast.error("Logout failed. Please try again.");
    } finally {
      logout();
      setLoggingOut(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      {isAuthenticated ? (
        <div className="relative group">
          {loggingOut && <Preloader />}
          <UserDropdown
            profilePic={user?.profilePic} // Get from context user object
            handleProfileClick={() => navigate("/profile")}
            handleLogout={handleLogout}
            loggingOut={loggingOut}
            profileLoading={profileLoading}
          />
          <div className="absolute -bottom-8 left-1/2 hidden xs:block -translate-x-1/2 bg-black text-white text-xs rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
            Profile
          </div>
        </div>
      ) : (
        <div className="relative group">
          <Link
            to="/Login"
            className="w-[35px] h-[35px] flex items-center justify-center rounded-full text-black hover:text-blue-500 transition duration-200"
          >
            <RiLoginCircleLine size={30} className="text-black md:text-white" />
          </Link>
          <div className="hidden md:absolute -bottom-7 left-1/2 -translate-x-1/2 bg-black text-white text-xs rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
            Login
          </div>
        </div>
      )}
    </div>
  );
};
