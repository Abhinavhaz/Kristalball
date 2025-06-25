import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { dashboardAPI } from '../../services/api';
import MetricsCards from './MetricsCards';
import FiltersPanel from './FiltersPanel';
import RecentActivities from './RecentActivities';
import LowStockAlerts from './LowStockAlerts';
import { motion } from 'framer-motion';
import { ShieldCheckIcon } from '@heroicons/react/24/outline';

const Dashboard = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState(null);
  const [recentActivities, setRecentActivities] = useState(null);
  const [alerts, setAlerts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    baseId: '',
    assetType: '',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    fetchDashboardData();
  }, [filters]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await dashboardAPI.getMetrics(filters);
      
      if (response.data.success) {
        const { metrics, recentActivities, alerts } = response.data.data;
        setMetrics(metrics);
        setRecentActivities(recentActivities);
        setAlerts(alerts);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-center">
        <div>
          <p className="text-red-500 text-lg mb-4">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  };

  return (
    <motion.div 
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Welcome Header */}
      <motion.div 
        className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-lg p-6 md:p-8 text-white overflow-hidden"
        variants={itemVariants}
      >
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Welcome, {user?.rank} {user?.lastName}</h1>
            <p className="mt-1 text-blue-200">Here's your operational overview for today.</p>
          </div>
          <ShieldCheckIcon className="h-16 w-16 text-white opacity-20 hidden sm:block" />
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div variants={itemVariants}>
        <FiltersPanel 
          filters={filters} 
          onFilterChange={handleFilterChange}
          userRole={user?.role}
          userBase={user?.assignedBase}
        />
      </motion.div>

      {/* Metrics Cards */}
      {metrics && (
        <motion.div variants={itemVariants}>
          <MetricsCards metrics={metrics} />
        </motion.div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Recent Activities */}
        <motion.div className="xl:col-span-2" variants={itemVariants}>
          {recentActivities && <RecentActivities activities={recentActivities} />}
        </motion.div>

        {/* Low Stock Alerts */}
        <motion.div variants={itemVariants}>
          {alerts && <LowStockAlerts alerts={alerts.lowStockItems} />}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
