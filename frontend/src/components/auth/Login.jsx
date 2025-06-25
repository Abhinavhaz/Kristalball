import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { EyeIcon, EyeSlashIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading, error, clearError } = useAuth();

  useEffect(() => {
    // Clear any existing errors when component mounts
    clearError();
  }, [clearError]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (error) {
      clearError();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.password) {
      return;
    }

    await login(formData);
    // Navigation will be handled automatically by the routing system
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <motion.div 
        className="max-w-md w-full mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="text-center mb-8">
          <ShieldCheckIcon className="h-16 w-16 mx-auto text-indigo-600" />
          <h1 className="mt-4 text-4xl font-extrabold text-gray-900">Kristalball</h1>
          <p className="mt-2 text-md text-gray-600">Military Asset Management System</p>
        </motion.div>
        
        <motion.div 
          variants={itemVariants}
          className="bg-white p-8 shadow-2xl rounded-2xl"
        >
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-1">Welcome Back</h2>
          <p className="text-center text-gray-600 mb-6">Sign in to your account</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <motion.div variants={itemVariants}>
              <label htmlFor="username" className="sr-only">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="w-full px-4 py-3 rounded-lg bg-gray-100 border-transparent focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 transition"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
              />
            </motion.div>

            <motion.div variants={itemVariants} className="relative">
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                className="w-full px-4 py-3 rounded-lg bg-gray-100 border-transparent focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 transition"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </motion.div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative"
                variants={itemVariants}
              >
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
              </motion.div>
            )}

            <motion.div variants={itemVariants}>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </motion.div>

            <motion.div variants={itemVariants} className="text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="font-medium text-indigo-600 hover:underline">
                Register here
              </Link>
            </motion.div>
          </form>
        </motion.div>
        
        <motion.div variants={itemVariants} className="text-sm text-gray-500 mt-6 text-center">
          <p className="font-semibold mb-1">Demo Credentials:</p>
          <p>Admin: admin / Admin123!</p>
          <p>Commander: commander1 / Commander123!</p>
          <p>Logistics: logistics1 / Logistics123!</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
