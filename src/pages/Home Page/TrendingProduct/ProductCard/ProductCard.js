import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { listProducts } from "../../../../services/productApi/productApi";
import { ProductItem } from "./ProductItem";
import { useWishlist } from "../../../../hooks/useWishlist";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../../../hooks/useCart";
import ProductQuickView from "../../../../components/Buttons/ProductQuickView/ProductQuickView";

export const ProductCard = () => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showTooltip, setShowTooltip] = useState(null);
  const [slidesToShow, setSlidesToShow] = useState(1);
  const [isHovered, setIsHovered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(true);
  const [canFitAll, setCanFitAll] = useState(false);
  const [hasMeasured, setHasMeasured] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  // Use the cart hook
  const { quickAddToCart, loadingItems, cartItems = [] } = useCart();

  // Use the wishlist hook
  const {
    isInWishlist,
    toggleWishlist,
    isLoading: wishlistLoading,
  } = useWishlist();

  const openQuickView = (product) => {
    setQuickViewProduct(product);
    setIsQuickViewOpen(true);
  };

  const closeQuickView = () => {
    setIsQuickViewOpen(false);
    setQuickViewProduct(null);
  };

  // Calculate slides to show and whether all products fit in view
  useEffect(() => {
    const calculate = () => {
      if (!containerRef.current) return;

      const containerWidth = containerRef.current.offsetWidth;
      const cardWidthWithGap = 324;
      const calculatedSlides = Math.floor(containerWidth / cardWidthWithGap);

      setSlidesToShow(Math.max(1, calculatedSlides));

      const totalNeededWidth = products.length * cardWidthWithGap;
      setCanFitAll(totalNeededWidth <= containerWidth);
      setHasMeasured(true);
    };

    calculate();
    window.addEventListener("resize", calculate);
    return () => window.removeEventListener("resize", calculate);
  }, [products]);

  // Fetch Featured Products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Call paginated API with filters
        const res = await listProducts({
          is_featured: true,
          page: 1,
          page_size: 20,
        });
        const productsData = res.data.results || [];
        setProducts(productsData);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Build displayed (cloned) products whenever base products or slidesToShow changes
  useEffect(() => {
    if (products.length > 0) {
      const cloneCount = Math.min(slidesToShow, products.length);
      const headClones = products.slice(0, cloneCount);
      const tailClones = products.slice(products.length - cloneCount);
      const merged = [...tailClones, ...products, ...headClones];
      setDisplayedProducts(merged);
      // Start at first real item (after left clones)
      setCurrentIndex(cloneCount);
    } else {
      setDisplayedProducts([]);
      setCurrentIndex(0);
    }
  }, [products, slidesToShow]);

  // Auto Slide every 5s only if in carousel mode (with clones)
  useEffect(() => {
    if (
      hasMeasured &&
      !canFitAll &&
      displayedProducts.length > slidesToShow &&
      !isHovered
    ) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => prev + 1);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [displayedProducts, slidesToShow, isHovered, canFitAll, hasMeasured]);

  // After each animation, if we're on a clone, jump seamlessly to the equivalent real index
  useEffect(() => {
    const cloneCount = Math.min(slidesToShow, products.length);
    const lastRealIndex = cloneCount + products.length - 1;
    if (products.length === 0) return;

    if (currentIndex > lastRealIndex) {
      // Jump to first real slide
      setIsAnimating(false);
      setCurrentIndex(cloneCount);
      // Next tick re-enable animation
      const id = setTimeout(() => setIsAnimating(true), 0);
      return () => clearTimeout(id);
    }

    if (currentIndex < cloneCount) {
      // Jump to last real slide
      setIsAnimating(false);
      setCurrentIndex(cloneCount + products.length - 1);
      const id = setTimeout(() => setIsAnimating(true), 0);
      return () => clearTimeout(id);
    }
  }, [currentIndex, products.length, slidesToShow]);

  // Handle add to cart - this will be passed to ProductItem
  const handleAddToCart = async (productId) => {
    try {
      await quickAddToCart(productId);
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  // Handle product click
  const handleProductClick = (productId) => {
    if (productId) {
      navigate(`/products/${productId}`);
    }
  };

  if (loading) {
    return (
      <div
        ref={containerRef}
        className="flex flex-wrap justify-center gap-6 px-6 py-10 max-w-375:py-0 max-w-375:px-0"
      >
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} className="flex-shrink-0 px-3">
            <div className="mx-auto animate-pulse" style={{ width: "300px" }}>
              {/* Image */}
              <div className="w-full h-48 bg-gray-200 rounded-xl mb-4"></div>

              {/* Title */}
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>

              {/* Price */}
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>

              {/* Action buttons (wishlist + cart) */}
              <div className="flex gap-3">
                <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                <div className="h-10 flex-1 rounded-lg bg-gray-200"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Don't show carousel if all products fit on screen
  if (hasMeasured && canFitAll) {
    return (
      <div
        ref={containerRef}
        className="flex flex-wrap justify-center gap-6 px-6 py-10 max-w-375:py-0 max-w-375:px-0"
      >
        {products.map((product, index) => (
          <div
            key={`${product.id}-${index}`}
            className="flex-shrink-0 px-3 "
          >
            <div className="mx-auto max-w-375:w-[280px]" style={{ width: "300px" }}>
              <ProductItem
                product={product}
                isWishlisted={isInWishlist(product.id)}
                onWishlistToggle={toggleWishlist}
                showTooltip={showTooltip}
                setShowTooltip={setShowTooltip}
                wishlistLoading={wishlistLoading}
                onProductClick={handleProductClick}
                // Cart related props
                cartItems={cartItems}
                loadingItems={loadingItems}
                onAddToCart={handleAddToCart}
                // Quick View prop - ADD THIS LINE
                onQuickViewClick={openQuickView}
              />
            </div>
          </div>
        ))}
        {/* Add the QuickView modal here */}
        {isQuickViewOpen && quickViewProduct && (
          <ProductQuickView
            product={quickViewProduct}
            isOpen={isQuickViewOpen}
            onClose={closeQuickView}
            onWishlistToggle={toggleWishlist}
          />
        )}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative w-[95%] max-w-375:w-[98%] max-w-375:py-4 overflow-hidden py-10"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Carousel Track */}
      <motion.div
        className="flex"
        drag={canFitAll ? false : "x"}
        dragConstraints={{
          left: -((displayedProducts.length - slidesToShow) * 324),
          right: 0,
        }}
        animate={{ x: -currentIndex * 324 }}
        transition={
          isAnimating
            ? { type: "spring", stiffness: 80, damping: 20 }
            : { duration: 0 }
        }
        style={{ cursor: "grab" }}
        onDragEnd={(e, { offset, velocity }) => {
          const stepWidth = 324; // width per step
          // Effective distance includes momentum from velocity
          const momentum = velocity.x * 0.2; // tune factor for feel
          const totalDx = offset.x + momentum;
          const stepsFloat = totalDx / stepWidth; // positive => drag right
          let steps = 0;
          if (stepsFloat > 0.3) {
            steps = Math.floor(stepsFloat); // move multiple left steps
          } else if (stepsFloat < -0.3) {
            steps = Math.ceil(stepsFloat); // move multiple right steps (negative)
          }

          if (steps !== 0) {
            setCurrentIndex((prev) => {
              const maxIndex = displayedProducts.length - 1; // allow dragging to clones
              let next = prev - steps; // subtract because right drag yields negative steps
              if (next < 0) next = 0;
              if (next > maxIndex) next = maxIndex;
              return next;
            });
          }
        }}
      >
        {displayedProducts.map((product, index) => (
          <div key={`${product.id}-${index}`} className="flex-shrink-0 px-3">
            <div className="mx-auto w-[300px]" >
              <ProductItem
                product={product}
                isWishlisted={isInWishlist(product.id)}
                onWishlistToggle={toggleWishlist}
                showTooltip={showTooltip}
                setShowTooltip={setShowTooltip}
                wishlistLoading={wishlistLoading}
                onProductClick={handleProductClick}
                // Cart related props
                cartItems={cartItems}
                loadingItems={loadingItems}
                onAddToCart={handleAddToCart}
                // Quick View prop - ADD THIS LINE
                onQuickViewClick={openQuickView}
              />
            </div>
          </div>
        ))}
      </motion.div>

      {/* Add the QuickView modal here */}
      {isQuickViewOpen && quickViewProduct && (
        <ProductQuickView
          product={quickViewProduct}
          isOpen={isQuickViewOpen}
          onClose={closeQuickView}
          onWishlistToggle={toggleWishlist}
        />
      )}
      {/* Dots - only show when in carousel mode */}
      {!canFitAll && (
        <div className="flex justify-center mt-6">
          {Array.from({ length: products.length }).map((_, i) => {
            const cloneCount = Math.min(slidesToShow, products.length);
            const activeIndex =
              (currentIndex - cloneCount + products.length) % products.length;
            return (
              <button
                key={i}
                className={`w-3 h-3 rounded-full mx-1 ${
                  i === activeIndex ? "bg-[#DC2626]" : "bg-gray-300"
                }`}
                onClick={() => setCurrentIndex(i + cloneCount)}
                aria-label={`Go to slide ${i + 1}`}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
