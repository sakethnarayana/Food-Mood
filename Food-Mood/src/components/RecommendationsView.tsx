import { ChevronLeft } from 'lucide-react';
import { Dish, DishAvailability } from '../types';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp as solidThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { faThumbsUp as regularThumbsUp } from '@fortawesome/free-regular-svg-icons';
import { faThumbsDown as solidThumbsDown } from '@fortawesome/free-solid-svg-icons';
import { faThumbsDown as regularThumbsDown } from '@fortawesome/free-regular-svg-icons';
import axios from 'axios';
import { toast } from 'react-hot-toast';

interface RecommendationsViewProps {
  recommendations: Dish[];
  dishAvailability: DishAvailability[];
  onDishClick: (dish: Dish) => void;
  onBack: () => void;
}



export default function RecommendationsView({ recommendations, dishAvailability, onDishClick, onBack }: RecommendationsViewProps) {
  const [likes, setLikes] = useState<Record<string, 'like' | 'dislike' | null>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const isLoggedIn = recommendations.length > 0;

  const handleLike = async  (dishId: string) => {
    setLikes(prev => ({
      ...prev,
      [dishId]: prev[dishId] === 'like' ? null : 'like',
    }));
    await updateDishPreference(dishId, 'like');
  };

  const handleDislike = async (dishId: string) => {
    setLikes(prev => ({
      ...prev,
      [dishId]: prev[dishId] === 'dislike' ? null : 'dislike',
    }));
    await updateDishPreference(dishId, 'dislike');
  };

  const updateDishPreference = async (dishId: string, action: 'like' | 'dislike') => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token'); // or from a global state/context

      if (!token) {
        toast.error('You must be logged in to like or dislike dishes!');
        return;
      }

      const url = action === 'like' ? 'users/likeddishes' : 'users/dislikeddishes';
      
      const response = await axios.post(
        url,
        { dishId },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(`${action === 'like' ? 'Liked' : 'Disliked'} dish successfully.`);
      // Optionally, update UI based on backend response, if needed

    } catch (err) {
      console.error(err);
      alert('An error occurred. Please try again later.'+err);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <button
        onClick={onBack}
        className="mb-6 flex items-center text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
      >
        <ChevronLeft className="h-5 w-5" />
        <span>Back</span>
      </button>

      <h1 className="text-3xl font-bold text-primary-800 dark:text-primary-200 mb-8">
        Recommended for You
      </h1>
      {isLoggedIn ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {recommendations.map((dish) => (
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
                  <p className="text-white/80 text-sm">{dish.vegetarian ? 'Veg' : 'Non-veg'} - {dish.calories} cal</p>
                </div>
              </div>
              <div className="p-4">
                <div className="flex flex-wrap gap-1 mb-2">
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
                    ${Math.min(...dishAvailability.filter(availability => availability.dish_id === dish._id).map(availability => availability.price)) || 'Price not available'}
                  </span>
                  <div className="flex space-x-2">
                    <button
                      className="p-2 rounded-full transition-colors"
                      onClick={() => handleLike(dish._id)}
                    >
                      <FontAwesomeIcon
                        icon={likes[dish._id] === 'like' ? solidThumbsUp : regularThumbsUp}
                        className={`h-5 w-5 ${likes[dish._id] === 'like' ? 'text-green-600' : 'text-gray-500'
                          }`}
                      />
                    </button>

                    <button
                      className="p-2 rounded-full transition-colors"
                      onClick={() => handleDislike(dish._id)}
                    >
                      <FontAwesomeIcon
                        icon={likes[dish._id] === 'dislike' ? solidThumbsDown : regularThumbsDown}
                        className={`h-5 w-5 ${likes[dish._id] === 'dislike' ? 'text-red-600' : 'text-gray-500'
                          }`}
                      />
                    </button>


                  </div>
                </div>
                <button
                  onClick={() => onDishClick(dish)}
                  className="mt-3 w-full bg-primary-500 hover:bg-primary-600 text-white py-2 rounded-lg transition-colors"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-primary-800 dark:text-primary-200 text-lg mt-10">
          Please login to see recommendations.
        </div>
      )}
    </div>
  );
}