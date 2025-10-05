# Wishlist Hook Documentation

## Overview

The `useWishlist` hook provides a centralized way to manage wishlist functionality across the application. It handles fetching wishlist data, adding/removing items, and maintaining wishlist state efficiently.

## Features

- **Automatic Initialization**: Fetches wishlist data on component mount
- **O(1) Lookup**: Uses Map for efficient product lookup
- **Real-time Updates**: Automatically updates UI when wishlist changes
- **Error Handling**: Built-in error handling with user-friendly messages
- **Authentication Check**: Automatically redirects to login if user is not authenticated

## Usage

### Basic Usage

```jsx
import { useWishlist } from "../hooks/useWishlist";

const MyComponent = () => {
  const {
    wishlistItems,
    isInWishlist,
    toggleWishlist,
    refreshWishlist,
    isLoading,
  } = useWishlist();

  // Check if a product is in wishlist
  const isWishlisted = isInWishlist(productId);

  // Toggle wishlist status
  const handleToggle = () => {
    toggleWishlist(productId);
  };

  return (
    <div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div>
          {wishlistItems.map((item) => (
            <div key={item.id}>{item.product.name}</div>
          ))}
        </div>
      )}
    </div>
  );
};
```

### With WishlistButton Component

```jsx
import { WishlistButton } from "../components/Buttons/WishlistButton";
import { useWishlist } from "../hooks/useWishlist";

const ProductCard = ({ product }) => {
  const { isInWishlist, toggleWishlist, isLoading } = useWishlist();

  return (
    <div className="relative">
      <img src={product.image} alt={product.name} />

      <WishlistButton
        productId={product.id}
        isWishlisted={isInWishlist(product.id)}
        onWishlistToggle={toggleWishlist}
        disabled={isLoading}
        size="default" // "small", "default", or "large"
      />
    </div>
  );
};
```

## Hook Return Values

| Property          | Type     | Description                                   |
| ----------------- | -------- | --------------------------------------------- |
| `wishlistItems`   | Array    | Array of wishlist items with product details  |
| `isInWishlist`    | Function | Function to check if a product is in wishlist |
| `toggleWishlist`  | Function | Function to add/remove product from wishlist  |
| `refreshWishlist` | Function | Function to manually refresh wishlist data    |
| `isLoading`       | Boolean  | Loading state for wishlist operations         |
| `isInitialized`   | Boolean  | Whether wishlist has been initialized         |

## WishlistButton Component Props

| Prop               | Type          | Default   | Description                               |
| ------------------ | ------------- | --------- | ----------------------------------------- |
| `productId`        | String/Number | Required  | ID of the product                         |
| `isWishlisted`     | Boolean       | Required  | Whether product is in wishlist            |
| `onWishlistToggle` | Function      | Required  | Function to handle wishlist toggle        |
| `disabled`         | Boolean       | false     | Whether button is disabled                |
| `size`             | String        | "default" | Size variant: "small", "default", "large" |

## API Endpoints Used

- `GET /Cart/wishlist/` - Fetch user's wishlist
- `POST /Cart/wishlist/` - Add product to wishlist
- `DELETE /Cart/wishlist/{id}/` - Remove product from wishlist

## Performance Optimizations

- **Memoized Components**: WishlistButton uses React.memo for performance
- **Efficient State Updates**: Uses Map for O(1) product lookup
- **Debounced Operations**: Prevents multiple rapid API calls
- **Conditional Rendering**: Only fetches data when needed

## Error Handling

- **Network Errors**: Shows user-friendly error messages
- **Authentication Errors**: Redirects to login page
- **API Errors**: Displays specific error messages from backend
- **Fallback States**: Graceful degradation when data is unavailable

## Best Practices

1. **Always check loading state** before rendering wishlist-dependent UI
2. **Use the hook at the top level** of your component tree
3. **Handle errors gracefully** with user-friendly messages
4. **Use the size prop** to match your design requirements
5. **Implement proper loading states** for better UX
