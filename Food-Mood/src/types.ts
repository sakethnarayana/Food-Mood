import { JwtPayload } from "jwt-decode";

export interface GenomeData {
  spiciness: number;
  sweetness: number;
  sourness: number;
  saltiness: number;
  bitterness: number;
  umami: number;
  crunchiness: number;
  creaminess: number;
  chewiness: number;
  juiciness: number;
  hotness: number;
  oiliness: number;
  smokiness: number;
  charredness: number;
  herbaceous: number;
  garlicky: number;
  oniony: number;
  citrusy: number;
  fermented: number;
  meatiness: number;
  seafoodiness: number;
  vegetal: number;
  dairiness: number;
  carb_rich: number;
  nutty: number;
}

export interface Dish {
  _id: string;
  name: string;
  description: string;
  image_url: string;
  calories: number;
  tags: string[];
  genome_data: GenomeData;
  vegetarian: boolean; 
  rating: number; 
}

export interface Restaurant {
  _id: string;
  name: string;
  image_url: string;
  rating: number;
  cuisine_type: string;
}

export interface PastOrder {
  dishId: Dish; 
  restaurantId: Restaurant;  
  totalPrice: number;
  quantity: number;
  date: Date;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  password_hash: string;
  liked_tags: string[];
  disliked_tags: string[];
  pastorders: PastOrder[];
}

export interface CartItem {
  dish_availability_id: string;  
  quantity: number;
}

export interface Cart {
  user_id: string;  
  items: CartItem[]; 
}

export interface DishAvailability {
  _id: string;  
  dish_id: string;  
  restaurant_id: string; 
  price: number;  
}

export interface CustomJwtPayload extends JwtPayload {
  exp?: number; // exp is optional, it may or may not be present
}