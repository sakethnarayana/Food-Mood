import { ChevronLeft, Star } from "lucide-react";
import { Dish, DishAvailability, Restaurant } from "../types";

interface AllRestaurantsViewProps {
  dishes: Dish[];
  restaurants: Restaurant[];
  dishAvailability: DishAvailability[];
  onRestaurantClick: (restaurant: Restaurant) => void;
  onBack: () => void;
}

export default function AllRestaurantsView({
  dishes,
  restaurants,
  dishAvailability,
  onRestaurantClick,
  onBack,
}: AllRestaurantsViewProps) {
  return (
    <div>
      <button
        onClick={onBack}
        className="mb-6 flex items-center text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
      >
        <ChevronLeft className="h-5 w-5" />
        <span>Back </span>
      </button>

      <h1 className="text-3xl font-bold text-primary-800 dark:text-primary-200 mb-8">
        All Restaurants
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {restaurants.map((restaurant) => (
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
                    {restaurant.rating.toFixed(1)}
                  </span>
                  <span className="mx-1 text-white/80">•</span>
                  <span className="text-sm text-white/80">
                    {restaurant.cuisine_type}
                  </span>
                </div>
              </div>
            </div>
            <div className="p-4">
              <div className="flex flex-wrap gap-2 mb-2">
                {dishAvailability
                  .filter(
                    (availability) =>
                      availability.restaurant_id === restaurant._id
                  ) // Filter by the current restaurant
                  .slice(0, 3) // Limit to the first 3 dishes
                  .map((availability, index) => {
                    const dish = dishes.find(
                      (dish) => dish._id === availability.dish_id
                    ); // Find the corresponding dish using dish_id

                    return (
                      <span
                        key={index}
                        className="px-2 py-1 bg-primary-100 dark:bg-primary-900/50 text-primary-800 dark:text-primary-200 text-xs rounded-full"
                      >
                        {dish
                          ? `${dish.name} - $${availability.price}`
                          : "Dish not found"}
                      </span>
                    );
                  })}

                {/* Show more if there are additional dishes */}
                {dishAvailability.filter(
                  (availability) =>
                    availability.restaurant_id === restaurant._id
                ).length > 3 && (
                  <span className="text-xs text-primary-600 dark:text-primary-400">
                    +
                    {dishAvailability.filter(
                      (availability) =>
                        availability.restaurant_id === restaurant._id
                    ).length - 3}{" "}
                    more
                  </span>
                )}
              </div>

              <p className="text-primary-600 dark:text-primary-400">
                Click to view full menu
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
