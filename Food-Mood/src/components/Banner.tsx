import { UtensilsCrossed } from 'lucide-react';

interface BannerProps {
  // Props go here
  onExpandClick1: () => void;
  onExpandClick2: () => void;
}

export default function Banner( {onExpandClick1,onExpandClick2}: BannerProps )  {
  return (
    <div className="relative bg-gradient-to-r from-primary-600 to-royal-600 h-[400px] max-w-screen-2xl mx-auto flex items-center justify-center overflow-hidden">
      {/* Decorative background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '30px 30px'
        }} />
      </div>

      <div className="relative z-10 text-center px-4">
        <div className="flex items-center justify-center mb-6">
          <UtensilsCrossed className="h-16 w-16 text-white" />
        </div>
        <h1 className="text-6xl font-bold text-white mb-4">
          FoodMoods
        </h1>
        <p className="text-xl text-white/90 max-w-2xl mx-auto">
          Discover the finest cuisines from top-rated restaurants. Your perfect meal is just a click away.
        </p>
        <div className="mt-8 flex gap-4 justify-center">
          <button onClick={onExpandClick1} className="bg-white text-primary-600 px-8 py-3 rounded-full font-semibold hover:bg-primary-50 transition-all duration-200 transform hover:scale-105">
            Order Now
          </button>
          <button onClick={onExpandClick2} className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white/10 transition-all duration-200">
            View Menu
          </button>
        </div>
      </div>

      {/* Decorative circles */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-white/10 rounded-full" />
    </div>
  );
}