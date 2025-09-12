import { useEffect, useState } from "react";
import { CustomJwtPayload, PastOrder, DishAvailability } from "../types";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";  // For redirection
import axios from "axios";
import {toast } from 'react-hot-toast';

interface PastOrdersProps {
  dishAvailability: DishAvailability[]; // Accept dishAvailability as prop
}

export default function PastOrders({ dishAvailability }: PastOrdersProps) {
  const [ordersByDate, setOrdersByDate] = useState<{
    [date: string]: PastOrder[];
  }>({});
  const navigate = useNavigate(); // Hook for navigation

  // Function to check token expiration
  const checkTokenExpiry = () => {
    const authToken = localStorage.getItem("token");

    if (authToken) {
      try {
        const decodedToken = jwtDecode<CustomJwtPayload>(authToken);

        if (decodedToken.exp) {
          const expiryTime = decodedToken.exp * 1000;
          if (expiryTime < Date.now()) {
            return false;
          } else {
            return true;
          }
        } else {
          console.warn("Token does not have an expiration time");
        }
      } catch (error) {
        console.error("Invalid token", error);
      }
    }
    return false;
  };

  useEffect(() => {
    const fetchPastOrders = async () => {
      try {
        if (checkTokenExpiry()) {
          const token = localStorage.getItem("token");
          const res = await axios.get("/users/pastorders", {
            headers: { Authorization: `Bearer ${token}` },
          });
          const orders: PastOrder[] = res.data.pastorders;

          // Group orders by date
          const grouped: { [date: string]: PastOrder[] } = {};

          orders.forEach((order) => {
            const dateOnly = new Date(order.date).toLocaleDateString("en-GB"); // "dd/mm/yyyy"
            if (!grouped[dateOnly]) {
              grouped[dateOnly] = [];
            }
            grouped[dateOnly].push(order);
          });

          // Sort orders within each date by time (ascending order)
          for (let date in grouped) {
            grouped[date].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
          }

          // Sort dates in descending order
          const sortedGrouped = Object.entries(grouped).sort(
            (a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime()
          );

          // Convert back to object with sorted dates
          const sortedOrdersByDate: { [date: string]: PastOrder[] } = {};
          sortedGrouped.forEach(([date, orders]) => {
            sortedOrdersByDate[date] = orders;
          });

          setOrdersByDate(sortedOrdersByDate);
        } else {
          toast.error("Your session has expired. Please log in again.");
          navigate("/"); // Redirect to login if token expired
        }
      } catch (err) {
        console.error("Error fetching past orders:", err);
      }
    };

    fetchPastOrders();
  }, [navigate]); // Dependency array includes navigate to handle token expiry

  // Function to find the price for a given dishId and restaurantId from dishAvailability
  const findPrice = (dishId: string, restaurantId: string): number => {
    const availability = dishAvailability.find(
      (item) => item.dish_id === dishId && item.restaurant_id === restaurantId
    );
    return availability ? availability.price : 0; // Return price or 0 if not found
  };
  console.log(ordersByDate);

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-primary-800 dark:text-primary-200 mb-4">
        Past Orders
      </h2>

      {Object.keys(ordersByDate).length === 0 ? (
        <p>No past orders yet.</p>
      ) : (
        Object.entries(ordersByDate).map(([date, orders]) => (
          <div key={date} className="mb-8">
            <h2 className="text-2xl text-gray-700 mb-4">{date}</h2>

            <div className="space-y-6">
              {orders.map((order, idx) => {
                const price = findPrice(order.dishId._id, order.restaurantId._id); // Find price for dish-restaurant combination
                return (
                  <div
                    key={idx}
                    className="flex items-center space-x-6 p-4 bg-gray-100 rounded-lg shadow-md"
                  >
                    <img
                      src={order.dishId.image_url}
                      alt={order.dishId.name}
                      className="w-20 h-20 rounded-lg object-cover"
                    />

                    <div className="flex-1">
                      <h3 className="text-xl font-semibold">{order.dishId.name}</h3>
                      <p className="text-gray-600">
                        {order.restaurantId.name} - {order.restaurantId.cuisine_type}
                      </p>
                      {/* Display the price from dishAvailability */}
                      <p className="text-sm text-gray-500">
                        Price: ${price.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Qty: {order.quantity}</p>
                      <p className="text-lg font-bold text-gray-800">
                        Total: ${order.totalPrice.toFixed(2)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

