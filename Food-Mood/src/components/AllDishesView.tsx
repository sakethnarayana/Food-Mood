import { ChevronLeft } from 'lucide-react';
import { Dish, DishAvailability } from '../types';
import { useState } from 'react';

interface AllDishesViewProps {
  dishes: Dish[];
  dishAvailability: DishAvailability[];
  onDishClick: (dish: Dish) => void;
  onBack: () => void;
}

export default function AllDishesView({
  dishes,
  dishAvailability,
  onDishClick,
  onBack,
}: AllDishesViewProps) {
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

  const filteredDishes = dishes.filter((dish) => {
    if (showVegetarian && !dish.vegetarian) return false;
    if (dish.calories < caloriesFilter) return false;
    return true;
  });

  const sortedDishes = [...filteredDishes].sort((a, b) => {
    if (sortBy === 'lowToHigh') {
      return (
        Math.min(
          ...dishAvailability.filter((availability) => availability.dish_id === a._id).map((availability) => availability.price)
        ) -
        Math.min(
          ...dishAvailability.filter((availability) => availability.dish_id === b._id).map((availability) => availability.price)
        )
      );
    } else if (sortBy === 'highToLow') {
      return (
        Math.min(
          ...dishAvailability.filter((availability) => availability.dish_id === b._id).map((availability) => availability.price)
        ) -
        Math.min(
          ...dishAvailability.filter((availability) => availability.dish_id === a._id).map((availability) => availability.price)
        )
      );
    }
    return 0;
  });

  return (
    <div>
      {/* Header and Filters in the same line */}
      <button
          onClick={onBack}
          className="flex items-center text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 mb-4 sm:mb-0 pb-4"
        >
          <ChevronLeft className="h-5 w-5" />
          <span>Back</span>
        </button>
      <div className="flex flex-col sm:flex-row items-center justify-between mb-8">

        <h1 className="text-3xl font-bold text-primary-800 dark:text-primary-200 flex-grow sm:mr-4 text-center sm:text-left mb-4 sm:mb-0">
          All Available Dishes
        </h1>

        {/* Filters Section */}
        <div className="flex items-center space-x-4 sm:space-x-6">
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
                showVegetarian ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <div
                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-300 ${
                  showVegetarian ? 'transform translate-x-6' : ''
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

      {/* Dishes Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {sortedDishes.map((dish) => (
          <div
            key={dish._id}
            className="cursor-pointer food-card bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden"
            onClick={() => onDishClick(dish)}
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
              <p className="text-sm text-primary-600 dark:text-primary-400 mb-2 line-clamp-2">
                {dish.description}
              </p>
              <div className="flex flex-wrap gap-1 mb-2">
                {dish.tags.map((genome, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-primary-100 dark:bg-primary-900/50 text-primary-800 dark:text-primary-200 text-xs rounded-full"
                  >
                    {genome}
                  </span>
                ))}
              </div>

              <div className="flex justify-between items-center">
                <span className="text-primary-800 dark:text-primary-200 font-medium">
                  ${Math.min(
                    ...dishAvailability
                      .filter((availability) => availability.dish_id === dish._id)
                      .map((availability) => availability.price)
                  ) || 'Price not available'}
                </span>
                <span className="text-sm text-primary-600 dark:text-primary-400">
                  {dish.calories} cal
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
