import React from "react";
import Carousel from "./BannerCarousel/Carousel";
import { TrendingProducts } from "./TrendingProduct/TrendingProducts";
import ReviewCarousel from "./ReviewSection/ReviewCarousel";
import WhyChooseUs from "./WhyChooseUs/WhyChooseUs";
import { DiscountSection } from "./DiscountSection/DiscountSection";
import AboutPage from "../AboutPage/AboutPage";


const HomePage = () => {
  return (
    <div className="w-full">
      <Carousel />
      <TrendingProducts />
      <DiscountSection />
      <WhyChooseUs />
      <ReviewCarousel />
      <AboutPage />
    </div>
  );
};

export default HomePage;
