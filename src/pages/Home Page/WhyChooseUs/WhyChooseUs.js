import React, { useEffect } from "react";

const WhyChooseUs = () => {
  useEffect(() => {
    // Simple fade-in animation on scroll
    const cards = document.querySelectorAll(".fade-in");

    function revealOnScroll() {
      const windowHeight = window.innerHeight;
      cards.forEach((card) => {
        const cardTop = card.getBoundingClientRect().top;
        if (cardTop < windowHeight - 100) {
          card.classList.add("visible");
        }
      });
    }

    window.addEventListener("scroll", revealOnScroll);
    window.addEventListener("load", revealOnScroll);

    return () => {
      window.removeEventListener("scroll", revealOnScroll);
      window.removeEventListener("load", revealOnScroll);
    };
  }, []);

  return (
    <section className="max-w-6xl mx-auto py-16 px-4 sm:px-6 lg:px-8 text-center">
      <div className="relative inline-block">
        <h2 className="text-3xl sm:text-4xl tracking-wide italic font-delius text-[#7C2D12] font-bold mb-2">
          Why Choose Us?
        </h2>
      </div>

      <p className="text-lg text-[#9A3412] font-josefin mb-12 max-w-2xl mx-auto">
        Discover what makes our food special and why we're the preferred choice
        for authentic flavors.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1 */}
        <div className="fade-in bg-white rounded-xl p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group">
          <div className="text-4xl mb-4 text-orange-700 group-hover:scale-110 transition-transform duration-300">
            🌶️
          </div>
          <h3 className="text-xl font-semibold  text-[#7C2D12] mb-3 group-hover:text-orange-700 transition-colors duration-300">
            Authentic Taste
          </h3>
          <p className="text-[#5d4037] leading-relaxed">
            Crafted with traditional South Indian recipes for that genuine
            flavor in every bite.
          </p>
        </div>

        {/* Card 2 */}
        <div className="fade-in bg-white rounded-xl p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group">
          <div className="text-4xl mb-4 text-orange-700 group-hover:scale-110 transition-transform duration-300">
            🌱
          </div>
          <h3 className="text-xl font-semibold  text-[#7C2D12] mb-3 group-hover:text-orange-700 transition-colors duration-300">
            Premium Ingredients
          </h3>
          <p className="text-[#5d4037] leading-relaxed">
            We source only the finest peanuts and spices to guarantee freshness
            and quality.
          </p>
        </div>

        {/* Card 3 */}
        <div className="fade-in bg-white rounded-xl p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group">
          <div className="text-4xl mb-4 text-orange-700 group-hover:scale-110 transition-transform duration-300">
            💯
          </div>
          <h3 className="text-xl font-semibold  text-[#7C2D12] mb-3 group-hover:text-orange-700 transition-colors duration-300">
            No Additives
          </h3>
          <p className="text-[#5d4037] leading-relaxed">
            100% natural products, free from artificial colors, preservatives,
            or flavors.
          </p>
        </div>

        {/* Card 4 */}
        <div className="fade-in bg-white rounded-xl p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group">
          <div className="text-4xl mb-4 text-orange-700 group-hover:scale-110 transition-transform duration-300">
            🚚
          </div>
          <h3 className="text-xl font-semibold  text-[#7C2D12] mb-3 group-hover:text-orange-700 transition-colors duration-300">
            Trusted Delivery
          </h3>
          <p className="text-[#5d4037] leading-relaxed">
            Sealed packaging & reliable delivery ensures you get crisp,
            flavorful products always.
          </p>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
