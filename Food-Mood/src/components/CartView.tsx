import { ChevronLeft, Minus, Plus, Trash2 } from 'lucide-react';
import { CartItem, Dish, DishAvailability, Restaurant } from '../types';

interface CartViewProps {
  cartItems: CartItem[];
  recommendations: Dish[];
  dishAvailability: DishAvailability[];
  dishes: Dish[];
  restaurants: Restaurant[];
  handleAddToCart: (dish: string, restaurantId: string) => void;
  handleUpdateCartQuantity: (dishId: string, restaurantId: string, change: number) => void;
  handleRemoveFromCart: (dish: string, restaurantId: string) => void;
  onBack: () => void;
  // onCheckout: () => void;
  onCheckout: (CartItems: CartItem[]) => void;
}

export default function CartView({
  cartItems,
  recommendations,
  dishAvailability,
  dishes,
  restaurants,
  handleAddToCart,
  handleUpdateCartQuantity,
  handleRemoveFromCart,
  onBack,
  onCheckout,
}: CartViewProps) {
  // Calculate subtotal, tax, delivery fee, and total
  const subtotal = cartItems.reduce((sum, item) => {
    const availability = dishAvailability.find(availability => availability._id === item.dish_availability_id);
    return availability ? sum + availability.price * item.quantity : sum;
  }, 0);

  const tax = subtotal * 0.1; // 10% tax
  const deliveryFee = 5.99;
  const total = subtotal + tax + deliveryFee;

  return (
    <div>
      <button
        onClick={onBack}
        className="mb-6 flex items-center text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
      >
        <ChevronLeft className="h-5 w-5" />
        <span>Back</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <h1 className="text-2xl font-bold text-primary-800 dark:text-primary-200 mb-6">
            Your Cart ({cartItems.length} items)
          </h1>

          <div className="space-y-4">
            {cartItems.map((item) => {
              // Find the matching DishAvailability
              const dishAvailabilityItem = dishAvailability.find(
                (availability) => availability._id === item.dish_availability_id
              );

              if (!dishAvailabilityItem) return null; // Skip if no matching DishAvailability

              // Find the corresponding Dish
              const dish = dishes.find((dish) => dish._id === dishAvailabilityItem.dish_id);

              // Find the corresponding Restaurant
              const restaurant = restaurants.find((restaurant) => restaurant._id === dishAvailabilityItem.restaurant_id);

              if (!dish || !restaurant) return null; // Skip if no matching dish or restaurant

              return (
                <div
                  key={item.dish_availability_id}
                  className="bg-white dark:bg-gray-800 rounded-xl p-4 flex items-center gap-4"
                >
                  <img
                    src={dish.image_url}
                    alt={dish.name}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div className="flex-grow">
                    <h3 className="font-medium text-primary-900 dark:text-primary-100">
                      {dish.name}
                    </h3>
                    <p className="text-sm text-primary-600 dark:text-primary-400">
                      {restaurant.name}
                    </p>
                    <p className="text-primary-800 dark:text-primary-200 font-medium mt-1">
                      ${dishAvailabilityItem.price.toFixed(2)} {/* Price from DishAvailability */}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() =>
                        handleUpdateCartQuantity(dish._id, restaurant._id, -1)
                      }
                      className="p-1 hover:bg-primary-100 dark:hover:bg-primary-900/50 rounded-full"
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                    </button>
                    <span className="text-primary-800 dark:text-primary-200 w-8 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        handleUpdateCartQuantity(dish._id, restaurant._id, 1)
                      }
                      className="p-1 hover:bg-primary-100 dark:hover:bg-primary-900/50 rounded-full"
                    >
                      <Plus className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                    </button>
                    <button
                      onClick={() =>
                        handleRemoveFromCart(dish._id, restaurant._id)
                      }
                      className="p-1 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full ml-2"
                    >
                      <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold text-primary-800 dark:text-primary-200 mb-4">
              Recommended for You
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {/* {recommendations.map((dish) => (
                <div
                  key={dish._id}
                  className="flex-none w-48 bg-white dark:bg-gray-800 rounded-xl overflow-hidden"
                >
                  <div className="h-32 relative">
                    <img
                      src={dish.image_url}
                      alt={dish.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-primary-900 dark:text-primary-100 text-sm">
                      {dish.name}
                    </h3>
                    <p className="text-xs text-primary-600 dark:text-primary-400">
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-primary-800 dark:text-primary-200 font-medium">
                      </span>
                      <button
                        // onClick={() => handleAddToCart(dish._id,pass that lowest price restuarnt id here )}
                        className="px-2 py-1 bg-primary-500 hover:bg-primary-600 text-white text-xs rounded-full"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              ))} */}


              {recommendations.map((dish) => {
                const availabilities = dishAvailability.filter((da) => da.dish_id === dish._id);
                if (availabilities.length === 0) return null;

                const cheapest = availabilities.reduce((min, curr) =>
                  curr.price < min.price ? curr : min, availabilities[0]);

                const restaurant = restaurants.find((r) => r._id === cheapest.restaurant_id);

                return (
                  <div
                    key={dish._id}
                    className="flex-none w-48 bg-white dark:bg-gray-800 rounded-xl overflow-hidden"
                  >
                    <div className="h-32 relative">
                      <img
                        src={dish.image_url}
                        alt={dish.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="font-medium text-primary-900 dark:text-primary-100 text-sm">
                        {dish.name}
                      </h3>
                      <p className="text-xs text-primary-600 dark:text-primary-400">
                        {restaurant?.name || 'Unknown Restaurant'}
                      </p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-primary-800 dark:text-primary-200 font-medium">
                          ${cheapest.price.toFixed(2)}
                        </span>
                        <button
                          // onClick={() => handleAddToCart(dish._id, restaurant?._id || '')}
                          onClick={() => {
                            handleAddToCart(dish._id, restaurant?._id || '');
                          }}
                          className="px-2 py-1 bg-primary-500 hover:bg-primary-600 text-white text-xs rounded-full"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

            </div>
          </div>

        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 sticky top-4">
            <h2 className="text-xl font-semibold text-primary-800 dark:text-primary-200 mb-4">
              Order Summary
            </h2>
            <div className="space-y-3 text-primary-600 dark:text-primary-400">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (10%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>${deliveryFee.toFixed(2)}</span>
              </div>
              <div className="border-t border-primary-100 dark:border-primary-800 pt-3 flex justify-between font-semibold text-primary-800 dark:text-primary-200">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            <button
              // onClick={onCheckout}
              onClick={() => onCheckout(cartItems)}
              disabled={cartItems.length === 0}
              className="w-full mt-6 bg-gradient-to-r from-primary-500 to-royal-600 hover:from-primary-600 hover:to-royal-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-3 px-4 rounded-full transition-all duration-200"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
