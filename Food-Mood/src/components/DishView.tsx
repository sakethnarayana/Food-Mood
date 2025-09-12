import { ChevronLeft, Star } from 'lucide-react';
import { Dish, DishAvailability, Restaurant } from '../types';
import { useParams } from 'react-router-dom';

interface DishViewProps {
  dishes: Dish[];
  restaurants: Restaurant[];
  dishAvailability: DishAvailability[];
  onRestaurantClick: (restaurant: Restaurant) => void;
  onBack: () => void;
}

export default function DishView({ dishes, restaurants, dishAvailability, onRestaurantClick, onBack }: DishViewProps) {
  const { dishId } = useParams<{ dishId: string }>();
  
  const dish = dishes.find((item) => item._id === dishId);

  if (!dish) {
    return <div>Dish not found</div>;
  }

  const availableDishLocations = dishAvailability.filter((availability) => availability.dish_id === dishId);

  // const availableRestaurants = availableDishLocations.map((availability) => {
  //   const restaurant = restaurants.find((restaurant) => restaurant._id === availability.restaurant_id);
  //   return { ...restaurant, price: availability.price };
  // }).filter((restaurant) => restaurant) ; 
  
  const availableRestaurants = availableDishLocations
  .map((availability) => {
    const restaurant = restaurants.find(
      (restaurant) => restaurant._id === availability.restaurant_id
    );
    // Ensure the restaurant is found before spreading it
    if (restaurant) {
      return { ...restaurant, price: availability.price };
    }
    return null; // Return null if restaurant is not found
  })
  .filter((restaurant) => restaurant !== null); // Remove null values


  return (
    <div>
      <button
        onClick={onBack}
        className="mb-6 flex items-center text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
      >
        <ChevronLeft className="h-5 w-5" />
        <span>Back</span>
      </button>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-8">
        <div className="relative h-44">
          <img
            src={dish.image_url}
            alt={dish.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h1 className="text-3xl font-bold text-white">{dish.name}</h1>
            <p className="text-white/80">{dish.vegetarian ? "veg" : "Non-veg"} • {dish.calories} cal</p>
          </div>
        </div>
        <div className="p-6">
          <p className="text-primary-800 dark:text-primary-200 mb-4">
            {dish.description}
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            {Array.isArray(dish.tags) && dish.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-primary-100 dark:bg-primary-900/50 text-primary-800 dark:text-primary-200 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="text-lg font-semibold text-primary-800 dark:text-primary-200">
            ${Math.min(...availableRestaurants.map(restaurant => restaurant.price)).toFixed(2)}
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-primary-800 dark:text-primary-200 mb-4">
        Available at these restaurants
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {availableRestaurants.map((restaurant) => (
          <div
            key={restaurant._id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-all"
            onClick={() => onRestaurantClick(restaurant)}
          >
            <div className="relative h-48">
              <img
                src={restaurant.image_url}
                alt={restaurant.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-xl font-semibold text-white">
                  {restaurant.name}
                </h3>
                <div className="flex items-center mt-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="ml-1 text-sm text-white">
                    {restaurant.rating}
                  </span>
                  <span className="mx-1 text-white/80">•</span>
                  <span className="text-sm text-white/80">
                    {restaurant.cuisine_type}
                  </span>
                </div>
              </div>
            </div>
            <div className="p-4">
              <p className="text-primary-600 dark:text-primary-400">
                Click to view full menu
              </p>
              {restaurant.price && (
                <div className="text-lg font-semibold text-primary-800 dark:text-primary-200">
                  Price: ${restaurant.price.toFixed(2)}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
