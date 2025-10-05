import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getProduct } from "../../services/productApi/productApi";
import { toast } from "react-toastify";
import Breadcrumb from "../../components/SubHeader/Breadcrumb";
import ProductImageGallery from "./ProductImageGallery/ProductImageGallery";
import ProductInfo from "./ProductInfo/ProductInfo";
import ProductIngredients from "./ProductIngredients/ProductIngredients";
import ProductNutrition from "./ProductNutrition/ProductNutrition";
import ProductReviews from "./ProductReviews/ProductReviews";
import { useCart } from "../../hooks/useCart";
import { useWishlist } from "../../hooks/useWishlist";
import ProductFAQ from "./ProductFAQ/ProductFAQ";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const { addToCartWithQty, isLoading: cartLoading } = useCart();
  const {
    isInWishlist,
    toggleWishlist,
    isLoading: wishlistLoading,
  } = useWishlist();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await getProduct(id);
        setProduct(response.data);

        // Set the first size as default if available
        if (response.data.sizes && response.data.sizes.length > 0) {
          setSelectedSize(response.data.sizes[0]);
        }
      } catch (error) {
        console.error("Error loading product:", error);
        toast.error("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleAddToCart = async () => {
    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }

    try {
      await addToCartWithQty(product.id, quantity, selectedSize.id);
    } catch {
      toast.error("Failed to add to cart");
    }
  };

  if (loading) {
    return (
      <div className="h-[100vh] bg-gradient-to-b from-orange-50 to-red-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-[100vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#FFF7ED]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#7C2D12] mb-4">
            Product Not Found
          </h2>
          <p className="text-[#9A3412]">
            The product you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  // Breadcrumb logic
  const breadcrumbItems = [
    { label: "Home", link: "/" },
    { label: "Products", link: "/products" },
    ...(product.category
      ? [
          {
            label: product.category_name,
            link: `/products?category=${encodeURIComponent(product.category)}`,
          },
        ]
      : []),
    { label: product.name, link: `/product/${product.id}` },
  ];

  return (
    <div className="min-h-screen bg-[#FFF7ED] pt-[13vh] pb-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <Breadcrumb items={breadcrumbItems} />

        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-[#FED7AA] mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 max-w-375:p-3 max-w-375:gap-4">
            <ProductImageGallery
              images={product.images}
              productName={product.name}
            />

            <ProductInfo
              product={product}
              selectedSize={selectedSize}
              setSelectedSize={setSelectedSize}
              quantity={quantity}
              setQuantity={setQuantity}
              onAddToCart={handleAddToCart}
              cartLoading={cartLoading}
              isWishlisted={isInWishlist(product.id)}
              onWishlistToggle={toggleWishlist}
              wishlistLoading={wishlistLoading}
            />
          </div>
        </div>

        <div className="mt-8 space-y-6">
          {product.ingredients && product.ingredients.length > 0 && (
            <ProductIngredients ingredients={product.ingredients} />
          )}

          {product.nutritional_facts &&
            product.nutritional_facts.length > 0 && (
              <ProductNutrition nutritionalFacts={product.nutritional_facts} />
            )}
          <ProductFAQ productId={product.id} />

          {product.reviews && product.reviews.length > 0 && (
            <ProductReviews reviews={product.reviews} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
