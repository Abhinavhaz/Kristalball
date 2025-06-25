import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { EyeIcon, EyeSlashIcon, UserPlusIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

const AuthForm = ({ type, loading, error, onSubmit, onClearError }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  const isRegister = type === 'register';

  useEffect(() => {
    onClearError();
  }, [onClearError]);

  useEffect(() => {
    if (isRegister) {
      const match = formData.password === formData.confirmPassword;
      setPasswordsMatch(match || formData.confirmPassword === '');
    }
  }, [formData.password, formData.confirmPassword, isRegister]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) onClearError();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isRegister && formData.password !== formData.confirmPassword) {
      setPasswordsMatch(false);
      return;
    }
    onSubmit(formData);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        damping: 15,
        stiffness: 100,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  const Icon = isRegister ? UserPlusIcon : ArrowRightOnRectangleIcon;
  const title = isRegister ? 'Create an Account' : 'Welcome Back';
  const subTitle = isRegister ? 'Join the force, manage with precision.' : 'Sign in to your command center.';

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-md p-8 space-y-6 bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20"
    >
      <motion.div variants={itemVariants} className="text-center text-white">
        <Icon className="w-12 h-12 mx-auto text-indigo-400" />
        <h1 className="mt-4 text-3xl font-bold">{title}</h1>
        <p className="mt-2 text-indigo-200">{subTitle}</p>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <motion.div variants={itemVariants}>
          <input
            name="username"
            type="text"
            placeholder="Username"
            required
            value={formData.username}
            onChange={handleChange}
            className="w-full px-4 py-3 text-white bg-black/20 rounded-lg border border-transparent focus:bg-black/30 focus:border-indigo-400 focus:ring-indigo-400 focus:ring-1 transition-all duration-300 outline-none"
          />
        </motion.div>

        {isRegister && (
          <motion.div variants={itemVariants}>
            <input
              name="email"
              type="email"
              placeholder="Email Address"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 text-white bg-black/20 rounded-lg border border-transparent focus:bg-black/30 focus:border-indigo-400 focus:ring-indigo-400 focus:ring-1 transition-all duration-300 outline-none"
            />
          </motion.div>
        )}

        <motion.div variants={itemVariants} className="relative">
          <input
            name="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            required
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-3 text-white bg-black/20 rounded-lg border border-transparent focus:bg-black/30 focus:border-indigo-400 focus:ring-indigo-400 focus:ring-1 transition-all duration-300 outline-none"
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-white">
            {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
          </button>
        </motion.div>

        {isRegister && (
          <motion.div variants={itemVariants} className="relative">
            <input
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm Password"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full px-4 py-3 text-white bg-black/20 rounded-lg border transition-all duration-300 outline-none focus:bg-black/30 focus:ring-1 ${passwordsMatch ? 'border-transparent focus:border-indigo-400 focus:ring-indigo-400' : 'border-red-500 ring-1 ring-red-500'}`}
            />
            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-white">
              {showConfirmPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
            </button>
          </motion.div>
        )}

        <AnimatePresence>
          {!passwordsMatch && isRegister && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-red-400 text-sm"
            >
              Passwords do not match.
            </motion.p>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="px-4 py-3 text-red-200 bg-red-500/30 rounded-lg"
            >
              <p className="font-semibold">Error:</p>
              <p>{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div variants={itemVariants}>
          <button
            type="submit"
            disabled={loading || (isRegister && !passwordsMatch)}
            className="w-full font-semibold text-white bg-indigo-600 rounded-lg py-3 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (isRegister ? 'Register' : 'Sign In')}
          </button>
        </motion.div>

        <motion.div variants={itemVariants} className="text-sm text-center text-indigo-200">
          {isRegister ? "Already have an account? " : "Don't have an account? "}
          <Link to={isRegister ? "/login" : "/register"} className="font-medium text-indigo-400 hover:underline">
            {isRegister ? "Sign In" : "Register here"}
          </Link>
        </motion.div>
      </form>
    </motion.div>
  );
};

export default AuthForm; 