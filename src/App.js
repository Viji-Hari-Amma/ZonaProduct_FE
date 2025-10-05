import { AuthProvider } from "./context/AuthContext";
import { WishlistProvider } from "./context/WishlistContext";
import { CartProvider } from "./context/CartContext";
import { ToastContainer } from "react-toastify";
import AppRouter from "./routes/Mainroutes/AppRouter";

const App = () => {
  return (
    <AuthProvider>
      <WishlistProvider>
        <CartProvider>
          <AppRouter />
        </CartProvider>
      </WishlistProvider>
      <ToastContainer
        position="top-left"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ top: "10vh" }}
      />
    </AuthProvider>
  );
};

export default App;
