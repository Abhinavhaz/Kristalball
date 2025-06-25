import { ExclamationTriangleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

const LowStockAlerts = ({ alerts }) => {
  if (!alerts || alerts.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md h-full flex flex-col justify-center items-center text-center">
        <CheckCircleIcon className="h-12 w-12 text-green-500 mb-4" />
        <h3 className="text-lg font-semibold text-gray-800">Excellent Stock Levels</h3>
        <p className="text-sm text-gray-500">All assets are well above minimum stock levels.</p>
      </div>
    );
  }

  const getStockLevel = (current, minimum) => {
    if (minimum === 0) return { level: 'adequate', color: 'text-gray-500', bgColor: 'bg-gray-100', percentage: 100 };
    const ratio = current / minimum;
    if (ratio <= 0.5) return { level: 'Critical', color: 'text-red-600', bgColor: 'bg-red-100', percentage: Math.round(ratio * 100) };
    if (ratio <= 1) return { level: 'Low', color: 'text-yellow-600', bgColor: 'bg-yellow-100', percentage: Math.round(ratio * 100) };
    return { level: 'adequate', color: 'text-green-600', bgColor: 'bg-green-100', percentage: Math.round(ratio * 100) };
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-800">Low Stock Alerts</h3>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800">
          {alerts.length} Alert{alerts.length !== 1 ? 's' : ''}
        </span>
      </div>
      
      <motion.div 
        className="space-y-3"
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.05 } }
        }}
      >
        {alerts.slice(0, 5).map((item) => {
          const stockInfo = getStockLevel(item.currentStock, item.asset?.minimumStock || 0);
          
          return (
            <motion.div
              key={item._id}
              className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
              variants={{
                hidden: { y: 20, opacity: 0 },
                visible: { y: 0, opacity: 1 }
              }}
            >
              <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${stockInfo.bgColor}`}>
                <ExclamationTriangleIcon className={`h-5 w-5 ${stockInfo.color}`} />
              </div>
              <div className="ml-4 flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">{item.asset?.name}</p>
                <p className="text-xs text-gray-500 truncate">{item.base?.name}</p>
              </div>
              <div className="text-right">
                <p className={`text-sm font-bold ${stockInfo.color}`}>{stockInfo.level}</p>
                <p className="text-xs text-gray-500">{item.currentStock} / {item.asset?.minimumStock}</p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
      
      {alerts.length > 5 && (
        <div className="mt-4 text-center">
          <button className="text-sm text-indigo-600 hover:text-indigo-800 font-semibold">
            View All ({alerts.length})
          </button>
        </div>
      )}
    </div>
  );
};

export default LowStockAlerts;
