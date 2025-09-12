import { ChevronRight } from 'lucide-react';
import { Dish } from '../types';

interface FeaturedDishesProps {
  dishes: Dish[] ;
  onExpandClick: () => void;
  onDishClick: (dish: Dish) => void;
}

export default function FeaturedDishes({ dishes, onExpandClick, onDishClick }: FeaturedDishesProps) {
  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-primary-800 dark:text-primary-200">Featured Dishes</h2>
        <button 
          onClick={onExpandClick}
          className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium flex items-center transition-colors"
        >
          View All
          <ChevronRight className="h-4 w-4 ml-1" />
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {dishes.map((dish) => (
          <div 
            key={dish._id}
            className="cursor-pointer food-card"
            onClick={() => onDishClick(dish)}
          >
            <div className="w-32 h-32 rounded-full overflow-hidden mb-3 mx-auto ring-2 ring-primary-100 dark:ring-primary-800">
              <img
                src={dish.image_url}
                alt={dish.name}
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-sm font-medium text-primary-900 dark:text-primary-100 text-center">
              {dish.name}
            </h3>
            <p className="text-xs text-primary-600 dark:text-primary-400 text-center">
              {dish.vegetarian? "Veg" : "Non-veg"}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}