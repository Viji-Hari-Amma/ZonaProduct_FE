import React from "react";
import { Link } from "react-router-dom";
import { FiChevronRight, FiHome } from "react-icons/fi";
import { motion } from "framer-motion";

const Breadcrumb = ({ items }) => {
  return (
    <nav className="mb-3 overflow-x-auto scrollbar-hide">
      <ol className="flex items-center text-sm whitespace-nowrap min-w-0">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <motion.li
              key={index}
              className="flex items-center shrink-0"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              {index > 0 && (
                <FiChevronRight className="mx-2 text-orange-400 flex-shrink-0" />
              )}

              {item.link && !isLast ? (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="min-w-0"
                >
                  <Link
                    to={item.link}
                    className="flex items-center gap-1 px-2 py-1 rounded-lg text-orange-600 hover:text-red-600 hover:bg-orange-50 transition-colors max-w-[150px] truncate"
                  >
                    {index === 0 && <FiHome className="text-lg shrink-0" />}
                    <span className="truncate">{item.label}</span>
                  </Link>
                </motion.div>
              ) : (
                <span className="flex items-center gap-1 px-2 py-1 rounded-lg text-orange-900 font-semibold bg-orange-50 max-w-[150px] truncate">
                  {index === 0 && <FiHome className="text-lg shrink-0" />}
                  <span className="truncate">{item.label}</span>
                </span>
              )}
            </motion.li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;