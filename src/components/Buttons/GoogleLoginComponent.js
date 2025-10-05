import { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { googleLogin } from "../../services/AuthService/AuthService";
import useAuth from "../../hooks/useAuth";

const GoogleLoginComponent = ({ from = "/" }) => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const buttonRef = useRef(null);
  const isMountedRef = useRef(true);

  // Use from prop or get from location
  const redirectPath = from || location.state?.from || "/";

  const handleCredentialResponse = async (response) => {
    try {
      const result = await googleLogin(response.credential);
      const { access, refresh, user_id, is_superuser, profile_pic, is_staff } =
        result.data;

      login({
        access,
        refresh,
        userId: user_id,
        isSuperuser: is_superuser,
        is_staff: is_staff,
        profilePic: profile_pic || "",
      });

      console.log("Google login response:", result.data.email);
      toast.success("Google login successful");

      // ✅ FIXED: Check for buy now data after login
      const buyNowData = sessionStorage.getItem("buyNowData");
      localStorage.setItem("userEmail", result.data.email);

      if (buyNowData) {
        const parsedData = JSON.parse(buyNowData);
        sessionStorage.removeItem("buyNowData");
        navigate("/checkout", { state: parsedData, replace: true });
      } else {
        navigate(redirectPath, { replace: true });
      }
    } catch (err) {
      console.error("Google login failed:", err);
      toast.error(err.response?.data?.error || "Google login failed");
    }
  };

  useEffect(() => {
    const initializeGoogle = () => {
      if (!window.google || !isMountedRef.current) return;

      window.google.accounts.id.initialize({
        client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
        ux_mode: "popup",
      });

      if (buttonRef.current) {
        window.google.accounts.id.renderButton(buttonRef.current, {
          theme: "filled_blue",
          size: "medium",
          text: "signin_with",
          shape: "pill",
          width: 200,
        });
      }
    };

    if (!window.google) {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogle;
      script.onerror = () => console.error("Google script failed to load");
      document.body.appendChild(script);
    } else {
      initializeGoogle();
    }

    return () => {
      isMountedRef.current = false;
      if (window.google) {
        window.google.accounts.id.cancel();
        window.google.accounts.id.disableAutoSelect();
      }
    };
  }, []);

  return (
    <div className="w-[50%] flex items-center justify-center">
      <div
        ref={buttonRef}
        className="rounded-full overflow-hidden shadow-md shadow-black"
      />
    </div>
  );
};

export default GoogleLoginComponent;
