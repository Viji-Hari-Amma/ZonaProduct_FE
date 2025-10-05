import React from "react";
import ImageOne from "../../../assets/images/HomePage/BannerImages/One.png";
import ImageTwo from "../../../assets/images/HomePage/BannerImages/Two.png";
import ImageThree from "../../../assets/images/HomePage/BannerImages/Three.png";
import ImageFour from "../../../assets/images/HomePage/BannerImages/Four.png";
import ImageFive from "../../../assets/images/HomePage/BannerImages/Five.png";

export const Banner = () => {
  return (
    <div className="w-full h-[70vh] flex items-center justify-center relative overflow-hidden">
      <img
        className="w-[220px] h-[220px] -mt-28 -mr-[100px] z-0 opacity-0 animate-fanLeft animation-delay-[200ms]"
        src={ImageOne}
        alt="ImageOne"
      />
      <img
        className="w-[220px] h-[220px] -mt-14 -mr-[180px] z-[1] opacity-0 animate-fanLeft animation-delay-[400ms]"
        src={ImageTwo}
        alt="ImageTwo"
      />
      <img
        className="w-[220px] h-[220px] -mr-[180px] z-[2] opacity-0 animate-fanCenter animation-delay-[600ms]"
        src={ImageThree}
        alt="ImageThree"
      />
      <img
        className="w-[220px] h-[220px] -mt-14 -mr-[100px] z-[1] opacity-0 animate-fanRight animation-delay-[800ms]"
        src={ImageFour}
        alt="ImageFour"
      />
      <img
        className="w-[220px] h-[220px] -mt-28 z-0 opacity-0 animate-fanRight animation-delay-[1000ms]"
        src={ImageFive}
        alt="ImageFive"
      />
    </div>
  );
};
