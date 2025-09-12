import { ChevronRight, Star } from 'lucide-react';
import { Restaurant } from '../types';

interface RestaurantsProps {
  restaurants: Restaurant[];
  onExpandClick: () => void;
  onRestaurantClick: (restaurant: Restaurant) => void;
}

export default function Restaurants({ restaurants, onExpandClick, onRestaurantClick }: RestaurantsProps) {
  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-primary-800 dark:text-primary-200">Popular Restaurants</h2>
        <button 
          onClick={onExpandClick}
          className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium flex items-center transition-colors"
        >
          View All
          <ChevronRight className="h-4 w-4 ml-1" />
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {restaurants.map((restaurant) => (
          <div
            key={restaurant._id}
            className="food-card bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-all"
            onClick={() => onRestaurantClick(restaurant)}
          >
            <div className="relative h-32">
              <img
                src={restaurant.image_url}
                alt={restaurant.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
            <div className="p-3">
              <h3 className="text-sm font-semibold text-primary-900 dark:text-primary-100 line-clamp-1">
                {restaurant.name}
              </h3>
              <div className="flex items-center mt-1">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="ml-1 text-xs text-primary-700 dark:text-primary-300">
                  {restaurant.rating.toFixed(1)}
                </span>
                <span className="mx-1 text-primary-400">•</span>
                <span className="text-xs text-primary-600 dark:text-primary-400 line-clamp-1">
                  {restaurant.cuisine_type}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}