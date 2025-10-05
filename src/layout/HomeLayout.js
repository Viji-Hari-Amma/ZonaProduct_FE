import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import { Outlet } from "react-router-dom";
// import SocialSidebar from "../components/Sidebar/SocialSidebar/SocialSidebar";

const HomeLayout = () => {
  return (
    <div className="font-serif">
      {/* <SocialSidebar /> */}
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default HomeLayout;
