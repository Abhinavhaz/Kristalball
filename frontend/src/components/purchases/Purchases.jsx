import { useState, useEffect } from 'react';
import { purchasesAPI } from '../../services/api';
import { PlusIcon, FunnelIcon, DocumentTextIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

const Purchases = () => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    status: '',
    assetType: '',
    startDate: '',
    endDate: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchPurchases();
  }, [filters]);

  const fetchPurchases = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await purchasesAPI.getAll(filters);
      
      if (response.data.success) {
        setPurchases(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching purchases:', error);
      setError('Failed to load purchases');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-blue-100 text-blue-800',
      ordered: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`;
  };

  const PageHeader = () => (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Purchases</h1>
        <p className="mt-1 text-gray-500">Manage all procurement and purchase orders.</p>
      </div>
      <div className="flex items-center space-x-2">
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className="p-2 rounded-md bg-white text-gray-500 hover:bg-gray-100 hover:text-gray-700 border border-gray-300 transition-colors"
        >
          <FunnelIcon className="h-5 w-5" />
        </button>
        <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 transition-colors">
          <PlusIcon className="h-5 w-5 mr-2" />
          New Purchase
        </button>
      </div>
    </div>
  );

  const FiltersComponent = () => (
    <AnimatePresence>
      {showFilters && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="bg-white p-6 rounded-lg shadow-md mb-8 overflow-hidden"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="input-field"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="ordered">Ordered</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Asset Type
              </label>
              <select
                value={filters.assetType}
                onChange={(e) => setFilters({ ...filters, assetType: e.target.value })}
                className="input-field"
              >
                <option value="">All Types</option>
                <option value="vehicle">Vehicles</option>
                <option value="weapon">Weapons</option>
                <option value="ammunition">Ammunition</option>
                <option value="equipment">Equipment</option>
                <option value="supplies">Supplies</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                className="input-field"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <PageHeader />
      <FiltersComponent />

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purchase Order</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asset</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Cost</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purchase Date</th>
                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan="7" className="text-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div></td></tr>
              ) : error ? (
                <tr><td colSpan="7" className="text-center py-12 text-red-500">{error}</td></tr>
              ) : purchases.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-12">
                    <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No purchases found</h3>
                    <p className="mt-1 text-sm text-gray-500">Create a new purchase order to get started.</p>
                  </td>
                </tr>
              ) : (
                purchases.map((purchase) => (
                  <motion.tr 
                    key={purchase._id}
                    className="hover:bg-gray-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{purchase.purchaseOrderNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{purchase.asset?.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{purchase.quantity.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${purchase.totalCost.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={getStatusBadge(purchase.status)}>
                        {purchase.status?.charAt(0).toUpperCase() + purchase.status?.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(purchase.purchaseDate).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button className="text-indigo-600 hover:text-indigo-900"><PencilIcon className="h-5 w-5" /></button>
                        <button className="text-red-600 hover:text-red-900"><TrashIcon className="h-5 w-5" /></button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default Purchases;
