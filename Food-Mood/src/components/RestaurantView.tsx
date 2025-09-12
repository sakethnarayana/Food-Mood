import { ChevronLeft, Minus, Plus } from "lucide-react";
import { Dish, DishAvailability, Restaurant } from "../types";
import { useParams } from "react-router-dom";
import { useState } from "react";

interface RestaurantViewProps {
  dishes: Dish[];
  restaurants: Restaurant[];
  dishAvailability: DishAvailability[];
  isInCart: (dishId: string, restaurantId: string) => boolean;
  getCartQuantity: (dishId: string, restaurantId: string) => number;
  handleAddToCart: (dish: string, restaurantId: string) => void;
  handleUpdateCartQuantity: (dishId: string, restaurantId: string, change: number) => void;
  onBack: () => void;
}

export default function RestaurantView({
  dishes,
  restaurants,
  dishAvailability,
  isInCart,
  getCartQuantity,
  handleAddToCart,
  handleUpdateCartQuantity,
  onBack,
}: RestaurantViewProps) {
  const { restaurantId } = useParams<{ restaurantId: string }>();

  const [sortBy, setSortBy] = useState<'lowToHigh' | 'highToLow' | 'none'>('none');
  const [showVegetarian, setShowVegetarian] = useState<boolean>(false);
  const [caloriesFilter, setCaloriesFilter] = useState<number>(0);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value as 'lowToHigh' | 'highToLow' | 'none');
  };

  const handleVegetarianToggle = () => {
    setShowVegetarian((prev) => !prev);
  };

  const handleCaloriesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCaloriesFilter(Number(e.target.value));
  };

  // Get restaurant dishes
  const restaurantDishes = dishAvailability
    .filter((availability) => availability.restaurant_id === restaurantId)
    .map((availability) => {
      const dish = dishes.find((d) => d._id === availability.dish_id);
      if (dish) {
        return { ...dish, price: availability.price };
      }
      return null;
    })
    .filter((dish): dish is Dish & { price: number } => dish !== null);

  // Apply filters
  const filteredDishes = restaurantDishes.filter((dish) => {
    if (showVegetarian && !dish.vegetarian) return false;
    if (dish.calories < caloriesFilter) return false;
    return true;
  });

  // Sort dishes
  const sortedDishes = [...filteredDishes].sort((a, b) => {
    if (sortBy === 'lowToHigh') {
      return a.price - b.price;
    } else if (sortBy === 'highToLow') {
      return b.price - a.price;
    }
    return 0;
  });

  const restaurant = restaurants.find((res) => res._id === restaurantId);

  if (!restaurant) {
    return <div>Restaurant not found</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        {/* Back to Home Button */}
        <button
          onClick={onBack}
          className="flex items-center text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
        >
          <ChevronLeft className="h-5 w-5" />
          <span>Back</span>
        </button>

        {/* Filters Section */}
        <div className="flex flex-wrap gap-6">
          {/* Price Sort Filter */}
          <div className="flex items-center">
            <label
              htmlFor="priceSort"
              className="text-sm font-medium text-primary-800 dark:text-primary-200 mr-2"
            >
              Sort by Price:
            </label>
            <select
              id="priceSort"
              value={sortBy}
              onChange={handleSortChange}
              className="p-2 border border-primary-300 dark:border-primary-600 rounded-lg w-32 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="none">None</option>
              <option value="lowToHigh">Low to High</option>
              <option value="highToLow">High to Low</option>
            </select>
          </div>

          {/* Vegetarian Toggle */}
          <div className="flex items-center space-x-2">
            <label
              htmlFor="vegetarian"
              className="text-sm font-medium text-primary-800 dark:text-primary-200"
            >
              Vegetarian:
            </label>
            <div
              onClick={handleVegetarianToggle}
              className={`relative w-12 h-6 cursor-pointer rounded-full transition duration-300 ${
                showVegetarian ? "bg-green-500" : "bg-gray-300"
              }`}
            >
              <div
                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-300 ${
                  showVegetarian ? "transform translate-x-6" : ""
                }`}
              ></div>
            </div>
          </div>

          {/* Calories Filter */}
          <div className="flex items-center">
            <label
              htmlFor="calories"
              className="text-sm font-medium text-primary-800 dark:text-primary-200 mr-2"
            >
              Min Calories:
            </label>
            <input
              type="range"
              id="calories"
              min="0"
              max="700"
              value={caloriesFilter}
              onChange={handleCaloriesChange}
              className="w-32"
            />
            <span className="ml-2 text-sm text-primary-600 dark:text-primary-400">{caloriesFilter} cal</span>
          </div>
        </div>
      </div>

      {/* Restaurant Info */}
      <div className="relative h-48 rounded-xl overflow-hidden mb-6">
        <img
          src={restaurant.image_url}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h1 className="text-3xl font-bold text-white">{restaurant.name}</h1>
          <p className="text-white/80">
            {restaurant.cuisine_type} • {restaurant.rating.toFixed(1)} ★
          </p>
        </div>
      </div>

      {/* Dishes */}
      {sortedDishes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedDishes.map((dish) => (
            <div
              key={dish._id}
              className="food-card bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden"
            >
              <div className="relative h-48">
                <img
                  src={dish.image_url}
                  alt={dish.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-medium">{dish.name}</h3>
                  <p className="text-white/80 text-sm">{dish.vegetarian ? 'Veg' : 'Non-veg'}</p>
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm text-primary-600 dark:text-primary-400 mb-4 line-clamp-2">
                  {dish.description} - {dish.calories} cal
                </p>
                <div className="flex flex-wrap gap-1 mb-4">
                  {dish.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-primary-100 dark:bg-primary-900/50 text-primary-800 dark:text-primary-200 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-primary-800 dark:text-primary-200 font-medium">
                    ${dish.price}
                  </span>
                  {isInCart(dish._id, restaurantId!) ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleUpdateCartQuantity(dish._id, restaurantId!, -1)}
                        className="p-1 hover:bg-primary-100 dark:hover:bg-primary-900/50 rounded-full"
                      >
                        <Minus className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                      </button>
                      <span className="text-primary-800 dark:text-primary-200 w-6 text-center">
                        {getCartQuantity(dish._id, restaurantId!)}
                      </span>
                      <button
                        onClick={() => handleUpdateCartQuantity(dish._id, restaurantId!, 1)}
                        className="p-1 hover:bg-primary-100 dark:hover:bg-primary-900/50 rounded-full"
                      >
                        <Plus className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleAddToCart(dish._id, restaurantId!)}
                      className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-full text-sm transition-colors"
                    >
                      Add to Cart
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="col-span-full text-center py-6 bg-gray-100 dark:bg-gray-700 text-primary-800 dark:text-primary-200 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold">No dishes found</h3>
          <p className="text-sm text-primary-600 dark:text-primary-400 mt-2">
            Sorry, there are no dishes available at the moment.
          </p>
        </div>
      )}
    </div>
  );
}
