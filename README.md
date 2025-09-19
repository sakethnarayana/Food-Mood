# FoodMood Frontend

FoodMood is a web application that helps users discover personalized dish recommendations based on their preferences. This is the frontend portion of the **FoodMood** project, which interacts with a backend API to fetch data about restaurants, dishes, and user preferences.

The application features a modern and intuitive user interface built with React and TypeScript. Users can toggle between light and dark modes, filter dishes by category (vegetarian/non-vegetarian), and sort them based on various factors like calories. Additionally, the platform uses personalized recommendations to suggest dishes based on past orders and user preferences.

### **Demo**

You can view the live demo of the frontend at:
[FoodMood Frontend](https://foodmoods.netlify.app/)

### **API Backend**

The frontend interacts with the backend API, which is hosted at:
[FoodMood API](https://food-mood-backend-q7gb.onrender.com/api/)

### **Setup and Installation**

Follow these steps to set up the project locally:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/sakethnarayana/Food-Mood.git
   cd Food-Mood
   ```

2. **Install dependencies:**

   Run the following command to install all necessary dependencies:

   ```bash
   npm install
   ```

3. **Create the `.env` file:**

   Create a `.env` file in the root of the project with the following content:

   ```env
   VITE_BACKEND_URL="https://food-mood-backend-q7gb.onrender.com/api"
   ```

4. **Run the development server:**

   Once the environment variables are set, run the following command to start the development server:

   ```bash
   npm run dev
   ```

   Your app will be live at `http://localhost:3000`.

### **Features**

* **User Preferences**: Users can like or dislike dishes to influence future recommendations.
* **Dish Recommendations**: Personalized dish recommendations based on user preferences, past orders, and liked dishes.
* **UI Features**:

  * Light and Dark Mode Toggle.
  * Search functionality to find dishes and restaurants. 
  * Sorting options for dishes (by price).
  * Filter for vegetarian and non-vegetarian dishes.
  * Calorie range slider to filter dishes based on their calorie content.

### **Tech Stack**

* **Frontend**: React, TypeScript, Vite
* **UI/UX**: Tailwind CSS, Lucide Icons, FontAwesome
* **API Client**: Axios for making HTTP requests
* **State Management**: React Context API for managing user preferences and theme state

### **Scripts**

* `npm run dev`: Start the development server.
* `npm run build`: Build the production version of the app.
* `npm run preview`: Preview the production build.
* `npm run lint`: Run ESLint to check for code quality.

### **Environment Variables**

This project requires the following environment variable:

* `VITE_BACKEND_URL`: The URL to your backend API (e.g., `https://food-mood-backend-q7gb.onrender.com/api`).

### **Deployment**

The application is deployed on [Netlify](https://foodmoods.netlify.app/), and it fetches data from the deployed backend API.

### **Contributing**

Feel free to fork the repository and submit issues or pull requests. Please ensure that you follow best practices and add relevant comments where necessary.
