import React from "react";
import { DesktopNav } from "./DesktopNav/DesktopNav";
import { MobileNav } from "./MobileNav/MobileNav";

const Header = () => {
  return (
    <>
      <div className="hidden xs:block">
        <DesktopNav />
      </div>
      <div className="block xs:hidden">
        <MobileNav />
      </div>
    </>
  );
};

export default Header;
