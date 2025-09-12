import { useState } from "react";
import { X, Eye, EyeOff } from "lucide-react";


 interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string, password: string) => void;
  onSignUp: (name: string,email: string, password: string) => Promise<boolean>;
}

export default function LoginModal({ isOpen, onClose, onLogin, onSignUp }: LoginModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // For confirm field

  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;


  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignUp) {
      if (!email || !password || !name || !confirmPassword) {
        setError('Please fill in all fields');
        setTimeout(() => setError(''), 1500); 
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        setTimeout(() => setError(''), 1500); 
        return;
      }
      if (!passwordRegex.test(password)) {
        setError(
          'Password must be at least 8 characters and include a letter and a number.'
        );
        setTimeout(() => setError(''), 3000);
        return;
      }
      if(await onSignUp(name, email, password)){
        setIsSignUp(false);
      }
    } else {
      if (!email || !password) {
        setError('Please fill in all fields');
        setTimeout(() => setError(''), 1500); 
        return;
      }
      onLogin(email, password);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-2xl font-bold text-primary-800 dark:text-primary-200 mb-6">
          {isSignUp ? 'Create Account' : 'Welcome Back'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          {isSignUp && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-primary-200 dark:border-primary-700 bg-white dark:bg-gray-900 text-primary-800 dark:text-primary-200"
                placeholder="Enter your full name"
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-primary-200 dark:border-primary-700 bg-white dark:bg-gray-900 text-primary-800 dark:text-primary-200"
              placeholder="Enter your email"
            />
          </div>

          <div className="relative">
  <label htmlFor="password" className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-1">
    Password
  </label>
  <input
    type={showPassword ? "text" : "password"}
    id="password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    className="w-full px-4 py-2 pr-10 rounded-lg border border-primary-200 dark:border-primary-700 bg-white dark:bg-gray-900 text-primary-800 dark:text-primary-200"
    placeholder="Enter your password"
  />
  <button
    type="button"
    onClick={() => setShowPassword((prev) => !prev)}
    className="absolute right-3 top-9 text-primary-600 dark:text-primary-400"
  >
    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
  </button>
</div>


          {isSignUp && (
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-primary-200 dark:border-primary-700 bg-white dark:bg-gray-900 text-primary-800 dark:text-primary-200"
                placeholder="Confirm your password"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-primary-500 to-royal-600 hover:from-primary-600 hover:to-royal-700 text-white font-bold py-3 px-4 rounded-full transition-all duration-200"
          >
            {isSignUp ? 'Create Account' : 'Login'}
          </button>

          <div className="text-center text-sm text-primary-600 dark:text-primary-400">
            {isSignUp ? (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setIsSignUp(false)}
                  className="text-royal-600 hover:text-royal-700 font-medium"
                >
                  Login
                </button>
              </>
            ) : (
              <>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setIsSignUp(true)}
                  className="text-royal-600 hover:text-royal-700 font-medium"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
