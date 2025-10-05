import React, { useState, useEffect } from "react";
import { BiSearchAlt } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { getAllProductNames } from "../../../../services/productApi/productApi";

export const InputSearch = () => {
  const [query, setQuery] = useState("");
  const [allProducts, setAllProducts] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await getAllProductNames();
        setAllProducts(products);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (query.trim() === "") {
      setFilteredResults([]);
      setShowResults(false);
    } else {
      const filtered = allProducts.filter((product) =>
        product.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredResults(filtered);
      setShowResults(true);
    }
  }, [query, allProducts]);

  const handleSelect = (productId) => {
    navigate(`/products/${productId}`);
    setQuery("");
    setShowResults(false);
  };

  return (
    <div className="relative xs:w-[50%] xs:min-w-[200px]">
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="pl-10 pr-6 rounded-md border border-gray-300 focus:border-blue-500 w-full focus:ring-2 focus:ring-blue-400 py-2 outline-none transition-all duration-200 shadow-sm"
        placeholder="Search Product"
      />
      <BiSearchAlt
        className="absolute top-1 left-[5px] text-gray-500 border-r p-1"
        size={32}
      />

      {showResults && filteredResults.length > 0 && (
        <ul className="absolute z-50 mt-1 bg-white border border-gray-200 rounded-md shadow-md w-full max-h-60 overflow-auto">
          {filteredResults.map((product) => (
            <li
              key={product.id}
              onClick={() => handleSelect(product.id)}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {product.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
