import React from "react";
import Logo from "../../../../assets/images/Logo/logo3.png";
import { InputSearch } from "../../DesktopNav/InputSearch/InputSearch";

export const TopNav = () => {
  return (
    <div className="fixed z-50 w-full h-[10vh] bg-white p-2 flex items-center justify-between">
      <div className="w-[45%]">
        <img src={Logo} alt="Logo" className="w-[120px] h-[8vh]" />
      </div>
      <div className="w-[55%]">
        <InputSearch />
      </div>
    </div>
  );
};
