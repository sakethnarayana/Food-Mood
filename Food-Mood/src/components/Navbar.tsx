import { useState, useEffect } from 'react';
import { User, ShoppingCart, Sun, Moon, ChevronDown, LogIn, History } from 'lucide-react';
import { User as UserType } from '../types';
import axios from 'axios';

interface NavbarProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
  cartItemsCount: number;
  onCartClick: () => void;
  isLoggedIn: boolean;
  onLogout: () => void;
  onLogin: () => void;
  onBack: () => void;
  onPastOrderClick: ()=>void;
}

export default function Navbar({
  isDarkMode,
  toggleTheme,
  cartItemsCount,
  onCartClick,
  isLoggedIn,
  onLogout,
  onLogin,
  onBack,
  onPastOrderClick
}: NavbarProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [mockUser, setMockUser] = useState<UserType | null>(null); // store user data here
  // const [showPastOrders, setShowPastOrders] = useState(false);

  // Fetch user profile after login
  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token'); // Get token from localStorage
      if (token) {
        try {
          const response = await axios.get('/users/profile', {
            headers: {
              Authorization: `Bearer ${token}`, // Send token in Authorization header
            },
          });
          setMockUser(response.data); // Set user data
        } catch (error) {
          console.error('Failed to fetch profile:', error);
        }
      }
    };

    if (isLoggedIn) {
      fetchUserProfile(); // Fetch profile only if user is logged in
    }
  }, [isLoggedIn]); // Dependency on isLoggedIn to fetch when login state changes
  return (
    <nav className="bg-primary-50/80 dark:bg-gray-900/80 backdrop-blur-md shadow-md transition-theme sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-royal-600 bg-clip-text text-transparent">
              <button onClick={onBack}>
                FoodMoods
              </button>
            </h1>
          </div>

          <div className="flex items-center space-x-6">
            <button 
              onClick={onCartClick}
              className="relative text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
            >
              <ShoppingCart className="h-6 w-6" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-royal-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </button>

            <button
              onClick={toggleTheme}
              className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
            >
              {isDarkMode ? (
                <Sun className="h-6 w-6" />
              ) : (
                <Moon className="h-6 w-6" />
              )}
            </button>

            {isLoggedIn && mockUser ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
                >
                  <User className="h-6 w-6" />
                  <p className="font-semibold text-primary-900 dark:text-primary-100">{isLoggedIn?`Hi ${mockUser.name}`:""}</p>
                  <ChevronDown className="h-4 w-4" />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-900 rounded-xl shadow-xl py-2 z-50 transition-theme">
                    <div className="px-4 py-3 border-b border-primary-100 dark:border-primary-800">
                      <p className="text-sm text-primary-600 dark:text-primary-400">
                        {mockUser.email}
                      </p>
                    </div>

                    <button
                      onClick={()=>{setIsProfileOpen(!isProfileOpen);onPastOrderClick()}}
                      className="w-full flex items-center px-4 py-2 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/50 transition-colors"
                    >
                      <History className="h-4 w-4 mr-2" />
                      <span>Past Orders</span>
                    </button>

                    {/* {showPastOrders && (
                      <div className="px-4 py-3 border-t border-primary-100 dark:border-primary-800">
                        {mockUser.pastorders?.map((order) => (
                          <div key={order.dishId} className="mb-2">
                            <p className="text-sm text-primary-800 dark:text-primary-200">
                              {order.dishId}
                            </p>
                            <p className="text-xs text-primary-600 dark:text-primary-400">
                              {order.dishId} • {order.totalPrice}
                            </p>
                          </div>
                        ))}
                      </div>
                    )} */}

                    <button
                      className="w-full text-left px-4 py-2 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/50 transition-colors"
                      onClick={onLogout}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <button
                  onClick={onLogin}
                  className="flex items-center space-x-2 px-4 py-2 rounded-full bg-primary-500 text-white hover:bg-primary-600 transition-colors"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Login</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
