import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import BGImage from "../assets/images/bg/bg2.png";
import Preloader from "../components/Loader/Preloader";

const AuthLayout = ({ children, title, description }) => {
  const { pathname } = useLocation();
  const [loading, setLoading] = useState(false);

  const isRegisterPage =
    pathname.includes("register") || pathname.includes("Admin/Register-Admin");

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [pathname]);

  if (loading) return <Preloader />;

  return (
    <div className="min-h-screen flex items-center justify-center p-1 relative">
      <img
        src={BGImage}
        alt="BG"
        className="absolute inset-0 w-full xs:h-[100vh] h-[110vh] blur-sm -z-10"
      />

      <div
        className={`
          w-full max-w-md bg-[#f5f5dcac]
          backdrop-blur-lg border-2 border-[#ffd29f]
          rounded-xl shadow-lg shadow-[#FAF5E9]
          mt-[10vh] 
          min-h-[55vh]
          max-h-[75vh]
          ${
            isRegisterPage
              ? "max-h-[80vh] overflow-y-scroll"
              : "max-h-fit overflow-y-hidden"
          }
          scrollbar
          scrollbar-thumb-rounded-full scrollbar-track-rounded-full
          scrollbar-thumb-amber-600/70 scrollbar-track-indigo-300/30
          hover:scrollbar-thumb-amber-700
        `}
      >
        <div className="p-3 xs:p-8">
          <div className="text-center mb-8 sticky">
            <h1 className="text-3xl font-bold text-[#8B0000]">{title}</h1>
            {description && (
              <p className="text-[#5e7b2c] mt-2">{description}</p>
            )}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
