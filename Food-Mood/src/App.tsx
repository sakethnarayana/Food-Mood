import { useState, useEffect } from "react";
import { useNavigate, Route, Routes } from "react-router-dom";
import { Cart, CartItem, CustomJwtPayload, Dish, DishAvailability, Restaurant } from "./types";
import Navbar from "./components/Navbar";
import PastOrders from "./components/PastOrders";
import Banner from "./components/Banner";
import Restaurants from "./components/Restaurants";
import RestaurantView from "./components/RestaurantView";
import RecommendationsView from "./components/RecommendationsView";
import CartView from "./components/CartView";
import LoginModal from "./components/LoginModal";
import SearchBar from "./components/SearchBar";
import AllDishesView from "./components/AllDishesView";
import AllRestaurantsView from "./components/AllRestaurantsView";
import Footer from "./components/Footer";
import axios, { AxiosError } from "axios";
import FeaturedDishes from "./components/FeaturedDishes";
import DishView from "./components/DishView";
import { jwtDecode } from "jwt-decode";
import { Toaster, toast } from 'react-hot-toast';

// Set base URL globally for all axios requests
// axios.defaults.baseURL = "https://foodmoodbackend-production-7d08.up.railway.app/api";
// axios.defaults.baseURL = import.meta.env.BACKEND_URL;
// axios.defaults.baseURL = "http://localhost:8000/api";
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;




function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [recommendations, setRecommendations] = useState<Dish[]>([]);
  const [dishAvailability, setDishAvailability] = useState<DishAvailability[]>(
    []
  );
  const [cart, setCart] = useState<Cart>({ user_id: "", items: [] });
  const [filteredDishes, setFilteredDishes] = useState<Dish[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>(
    []
  );
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const filteredSuggestions = [
    ...dishes.filter((dish) =>
      dish.name.toLowerCase().includes(searchQuery.toLowerCase())
    ).map((dish) => dish.name),
    ...restaurants.filter((restaurant) =>
      restaurant.name.toLowerCase().includes(searchQuery.toLowerCase())
    ).map((restaurant) => restaurant.name),
  ];

  const getRecommendations = async () => {
    try {
      const token = localStorage.getItem('token');

      const res = await axios.get('/users/recommendations', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setRecommendations(res.data.recommendations);
      console.log(res.data.recommendations);
      console.log(recommendations);
    } catch (err) {
      console.error("Failed to fetch recommendations:", err);
    }
  };
  ;

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {

    const getDishes = async () => {
      try {
        const res = await axios.get("/dishes");
        setDishes(res.data);
        setFilteredDishes(res.data);
      } catch (err) {
        console.error("Failed to fetch dishes:", err);
      }
    };

    const getRestaurants = async () => {
      try {
        const res = await axios.get("/restaurants");
        setRestaurants(res.data);
        setFilteredRestaurants(res.data);
      } catch (err) {
        console.error("Failed to fetch restaurants:", err);
      }
    };

    const getDishAvailability = async () => {
      try {
        const res = await axios.get("/dish-availability");
        setDishAvailability(res.data);
      } catch (err) {
        console.error("Failed to fetch restaurants:", err);
      }
    };

    const checkTokenExpiry = () => {
      const authToken = localStorage.getItem('token');

      if (authToken) {
        try {
          const decodedToken = jwtDecode<CustomJwtPayload>(authToken);

          if (decodedToken.exp) {
            const expiryTime = decodedToken.exp * 1000;
            if (expiryTime < Date.now()) {
              handleLogOut();
            } else {
              setIsLoggedIn(true);
            }
          } else {
            console.warn('Token does not have an expiration time');
          }
        } catch (error) {
          console.error('Invalid token', error);
        }
      }
    };

    checkTokenExpiry();
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
    const savedRecommendations = localStorage.getItem("recommendations");
    if (savedRecommendations) {
      setRecommendations(JSON.parse(savedRecommendations));
    }
    getDishes();
    getRestaurants();
    getDishAvailability();
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("recommendations", JSON.stringify(recommendations));
  }, [recommendations]);

  useEffect(() => {
    const query = searchQuery.toLowerCase();

    const filteredFoodsResult = dishes?.filter((dish) =>
      dish.name.toLowerCase().includes(query)
    );

    const filteredRestaurantsResult = restaurants?.filter(
      (restaurant) =>
        restaurant.name.toLowerCase().includes(query) ||
        restaurant.cuisine_type.toLowerCase().includes(query)
    );

    setFilteredDishes(filteredFoodsResult || []);
    setFilteredRestaurants(filteredRestaurantsResult || []);
  }, [searchQuery, dishes, restaurants]);

  // const getCart = async () => {
  //   const token = localStorage.getItem("token");
  //   try {
  //     const response = await axios.get(`/cart/`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //     setCart(response.data);
  //   } catch (err) {
  //     console.error("Failed to fetch cart:", err);
  //   }
  // };

  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await axios.post("/users/login", {
        email,
        password,
      });

      const { token } = response.data;

      localStorage.setItem("token", token);
      setIsLoggedIn(true);
      toast.success("Login successful");
      getRecommendations();
      setShowLoginModal(false);
      // getCart();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Login request failed", error);
        toast.error(error.response?.data?.message || " Something went wrong!");
      } else {
        console.error("Unexpected error", error);
        toast.error("Login Failed!");
      }
    }
  };

  const handleSignUp = async (
    name: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      const response = await axios.post("/users/register", {
        name: name,
        email,
        password,
      });

      if (response.status === 201) {
        toast.success("User created successfully. Please login.");
        return true;
      }


      toast.error("Unexpected response status.");
      return false;
    } catch (error) {
      
      if (error instanceof AxiosError && error.response && error.response.status === 409) {
        toast.error("Sign-up error: "+ error.response.data.error); // Will log: Email already exists
      } else {
        toast.error("Sign-up error:"+  (error as Error).message);
      }
      return false;
    }
  };

  function handleLogOut(): void {
    setCart({ user_id: "", items: [] });
    localStorage.removeItem("recommendations");
    localStorage.removeItem("cart");
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  }

  const handleDishClick = (dish: Dish) => {
    navigate(`/dish/${dish._id}`);
  };

  const handleRestaurantClick = (restaurant: Restaurant) => {
    navigate(`/restaurant/${restaurant._id}`);
  };

  const handleShowRecommendations = () => {
    getRecommendations();
    navigate("/recommendations");
  };

  const handleShowCart = () => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    navigate("/cart");
  };

  const handleAddToCart = (dish_id: string, restaurantId: string) => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }

    // Find the matching dish availability based on dish_id and restaurant_id
    const matchingDishAvailability = dishAvailability.find(
      (da) => da.dish_id === dish_id && da.restaurant_id === restaurantId
    );

    if (!matchingDishAvailability) {
      console.error("Dish availability not found for this dish and restaurant");
      return;
    }

    const newItem: CartItem = {
      dish_availability_id: matchingDishAvailability._id, // Using the existing dish_availability_id
      quantity: 1
    };

    setCart((prevCart) => {
      const existingItemIndex = prevCart.items.findIndex(
        (item) => item.dish_availability_id === newItem.dish_availability_id
      );

      if (existingItemIndex > -1) {
        // Item already in cart, increase quantity
        const updatedItems = [...prevCart.items];
        updatedItems[existingItemIndex].quantity += 1;
        return { ...prevCart, items: updatedItems };
      } else {
        // Item not in cart, add it
        return { ...prevCart, items: [...prevCart.items, newItem] };
      }
    });

    // setRecommendations((prev) => prev.filter((dish) => dish._id !== dish_id));


    console.log(
      "Item added to cart successfully, price: ",
      matchingDishAvailability.price
    );
  };

  const handleUpdateCartQuantity = (dishId: string, restaurantId: string, change: number) => {
    // Find the matching dish availability based on dish_id and restaurant_id
    const matchingDishAvailability = dishAvailability.find(
      (da) => da.dish_id === dishId && da.restaurant_id === restaurantId
    );

    if (!matchingDishAvailability) {
      console.error("Dish availability not found for this dish and restaurant");
      return;
    }

    setCart((prevCart) => {
      const itemIndex = prevCart.items.findIndex(
        (item) => item.dish_availability_id === matchingDishAvailability._id // Use the existing dish_availability_id
      );

      if (itemIndex > -1) {
        const updatedItems = [...prevCart.items];
        updatedItems[itemIndex].quantity += change;

        // Ensure quantity doesn't drop below 1
        if (updatedItems[itemIndex].quantity <= 0) {
          updatedItems.splice(itemIndex, 1); // Remove item if quantity is 0 or less
        }

        return { ...prevCart, items: updatedItems };
      } else {
        console.log("Item not found in cart");
        return prevCart;
      }
    });

    console.log(
      "Cart updated successfully, price: ",
      matchingDishAvailability.price
    );
  };

  const handleRemoveFromCart = (dishId: string, restaurantId: string) => {
    // Find the matching dish availability based on dish_id and restaurant_id
    const matchingDishAvailability = dishAvailability.find(
      (da) => da.dish_id === dishId && da.restaurant_id === restaurantId
    );

    if (!matchingDishAvailability) {
      console.error("Dish availability not found for this dish and restaurant");
      return;
    }

    setCart((prevCart) => {
      const updatedItems = prevCart.items.filter(
        (item) => item.dish_availability_id !== matchingDishAvailability._id // Use the existing dish_availability_id
      );
      return { ...prevCart, items: updatedItems };
    });

    console.log(
      "Item removed from cart successfully, price was: ",
      matchingDishAvailability.price
    );
  };

  const isInCart = (dishId: string, restaurantId: string): boolean => {
    // Find the matching dish availability based on dish_id and restaurant_id
    const matchingDishAvailability = dishAvailability.find(
      (da) => da.dish_id === dishId && da.restaurant_id === restaurantId
    );

    if (!matchingDishAvailability) {
      return false;
    }

    // Check if it's in the cart using the existing dish_availability_id
    return cart.items.some(
      (item) => item.dish_availability_id === matchingDishAvailability._id
    );
  };

  const getCartQuantity = (dishId: string, restaurantId: string): number => {
    // Find the matching dish availability to get the dish_availability_id
    const matchingDishAvailability = dishAvailability.find(
      (da) => da.dish_id === dishId && da.restaurant_id === restaurantId
    );

    if (!matchingDishAvailability) {
      return 0;
    }

    const item = cart.items.find(
      (item) => item.dish_availability_id === matchingDishAvailability._id
    );
    return item?.quantity || 0;
  };


  const handleCheckout = async (cartItems: { dish_availability_id: string, quantity: number }[]) => {
    console.log('Proceeding to checkout with the following items:', cartItems);

    try {
      // Loop through the cart items to prepare and send multiple orders
      for (const item of cartItems) {
        const { dish_availability_id, quantity } = item;

        // Find the corresponding DishAvailability object from the local state using dish_availability_id
        const dishAvailabilityF = dishAvailability.find((dish) => dish._id === dish_availability_id);

        if (!dishAvailabilityF) {
          console.error('DishAvailability not found for id:', dish_availability_id);
          continue; // Skip if the dishAvailability is not found
        }

        // Extract the necessary information directly from dishAvailability
        const dishId = dishAvailabilityF.dish_id; // dish_id from DishAvailability
        const restaurantId = dishAvailabilityF.restaurant_id; // restaurant_id from DishAvailability
        const price = dishAvailabilityF.price; // price from DishAvailability
        const totalPrice = price * quantity; // Calculate total price for this item

        // Prepare the order data
        const orderData = {
          dishId,
          restaurantId,
          quantity,
          totalPrice,
        };
        console.log(orderData);

        // Check if the user is logged in
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('You are not logged in!');
          navigate('/login'); // Redirect to login page if user is not logged in
          return;
        }

        // Send a POST request for each item in the cart to add it to the user's past orders
        const res = await axios.post('/users/pastorders', orderData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Handle success for each order
        console.log('Order placed successfully:', res.data);
      }

      // Redirect to the orders page or confirmation page after all orders have been placed
      toast.success('Checkout complete!');
      // localStorage.removeItem("cart");
      // { user_id: "", items: [] }
      setCart({ user_id: "", items: [] });
      navigate('/pastorders'); // Redirect to the orders page or any other page you prefer
      getRecommendations();
    } catch (err) {
      console.error('Error during checkout:', err);
      toast.error('There was an error during checkout. Please try again.');
    }
  };


  return (
    <>
    <Toaster position="top-center" />
    <div className="min-h-screen bg-primary-50 dark:bg-gray-900 transition-theme">
      <Navbar
        isDarkMode={isDarkMode}
        toggleTheme={() => setIsDarkMode(!isDarkMode)}
        cartItemsCount={cart.items.reduce((sum, item) => sum + item.quantity, 0)}
        onCartClick={handleShowCart}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogOut}
        onLogin={() => setShowLoginModal(true)}
        onBack={() => navigate('/')}
        onPastOrderClick={() => navigate('/pastorders')}
      />

      <main>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Banner
                  onExpandClick2={() => navigate("/allDishes")}
                  onExpandClick1={() => navigate("/allRestaurants")}
                />
                <div className="max-w-7xl mx-auto px-4 py-8">
                  <div className="mb-6">
                    <SearchBar
                      placeholder="Search restaurants and dishes..."
                      value={searchQuery}
                      onChange={setSearchQuery}
                      suggestions={filteredSuggestions}
                    />
                  </div>
                  <FeaturedDishes
                    dishes={filteredDishes && filteredDishes.slice(0, 5)}
                    onExpandClick={() => navigate("/allDishes")}
                    onDishClick={handleDishClick}
                  />
                  <Restaurants
                    restaurants={
                      filteredRestaurants && filteredRestaurants.slice(0, 5)
                    }
                    onExpandClick={() => navigate("/allRestaurants")}
                    onRestaurantClick={handleRestaurantClick}
                  />
                  <div className="text-center mt-12 mb-8">
                    <button
                      onClick={handleShowRecommendations}
                      className="bg-gradient-to-r from-primary-500 to-royal-600 hover:from-primary-600 hover:to-royal-700 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                    >
                      Recommend Me Something Delicious
                    </button>
                  </div>
                </div>
              </>
            }
          />

          <Route path="/pastorders" element={<><PastOrders dishAvailability={dishAvailability} /></>} />

          <Route
            path="/allDishes"
            element={
              <div className="max-w-7xl mx-auto px-4 py-8">
                {dishes && dishes.length > 0 ? (
                  <AllDishesView
                    dishes={dishes}
                    dishAvailability={dishAvailability}
                    onDishClick={handleDishClick}
                    onBack={() => navigate(-1)}
                  />
                ) : (
                  <p>No dishes available.</p> // or redirect, loading, etc.
                )}
              </div>
            }
          />

          <Route
            path="/dish/:dishId"
            element={
              <div className="max-w-7xl mx-auto px-4 py-8">
                <DishView
                  dishes={dishes}
                  restaurants={restaurants}
                  dishAvailability={dishAvailability}
                  onRestaurantClick={handleRestaurantClick}
                  onBack={() => navigate(-1)}
                />
              </div>
            }
          />


          <Route
            path="/allRestaurants"
            element={
              <div className="max-w-7xl mx-auto px-4 py-8">
                <AllRestaurantsView
                  dishes={dishes}
                  restaurants={restaurants}
                  dishAvailability={dishAvailability}
                  onRestaurantClick={handleRestaurantClick}
                  onBack={() => navigate(-1)}
                />
              </div>
            }
          />

          <Route
            path="/restaurant/:restaurantId"
            element={
              <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="mb-6">
                  <SearchBar
                    placeholder="Search dishes..."
                    value={searchQuery}
                    onChange={setSearchQuery}
                    suggestions={[
                      ...dishes.filter((dish) =>
                        dish.name.toLowerCase().includes(searchQuery.toLowerCase())
                      ).map((dish) => dish.name)]}
                  />
                </div>
                <RestaurantView
                  dishes={filteredDishes}
                  restaurants={restaurants}
                  dishAvailability={dishAvailability}
                  handleAddToCart={handleAddToCart}
                  handleUpdateCartQuantity={handleUpdateCartQuantity}
                  isInCart={isInCart}
                  getCartQuantity={getCartQuantity}
                  onBack={() => navigate(-1)}
                />
              </div>
            }
          />

          <Route
            path="/cart"
            element={
              <div className="max-w-7xl mx-auto px-4 py-8">
                <CartView
                  cartItems={cart.items}
                  dishAvailability={dishAvailability}
                  dishes={dishes}
                  restaurants={restaurants}
                  recommendations={recommendations}
                  handleUpdateCartQuantity={handleUpdateCartQuantity}
                  handleRemoveFromCart={handleRemoveFromCart}
                  handleAddToCart={handleAddToCart}
                  onBack={() => navigate(-1)}
                  onCheckout={handleCheckout} // <-- pass cart here
                />

              </div>
            }
          />

          <Route
            path="/recommendations"
            element={
              <RecommendationsView
                recommendations={recommendations}
                dishAvailability={dishAvailability}
                onDishClick={handleDishClick}
                onBack={() => navigate(-1)}
              />
            }

          />
        </Routes>
      </main>

      <Footer />
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => {
          setShowLoginModal(false);
        }}
        onLogin={handleLogin}
        onSignUp={handleSignUp}
      />
    </div>
    </>
  );
}

export default App;
