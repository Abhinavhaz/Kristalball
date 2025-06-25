import { 
  ShoppingCartIcon, 
  ArrowsRightLeftIcon, 
  UserGroupIcon,
  CheckCircleIcon,
  ClockIcon,
  TruckIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

const RecentActivities = ({ activities }) => {
  const getActivityIconAndColor = (type, status) => {
    const isCompleted = ['delivered', 'received', 'assigned'].includes(status);
    const isPending = ['pending', 'in_transit'].includes(status);

    switch (type) {
      case 'purchase':
        return { 
          Icon: ShoppingCartIcon, 
          color: isCompleted ? 'bg-green-500' : 'bg-yellow-500' 
        };
      case 'transfer':
        return { 
          Icon: TruckIcon, 
          color: isCompleted ? 'bg-blue-500' : 'bg-cyan-500' 
        };
      case 'assignment':
        return { 
          Icon: UserGroupIcon, 
          color: isCompleted ? 'bg-indigo-500' : 'bg-purple-500'
        };
      default:
        return { 
          Icon: ClockIcon, 
          color: 'bg-gray-500'
        };
    }
  };

  const formatActivity = (activity, type) => {
    switch (type) {
      case 'purchase':
        return {
          title: `Purchase Order ${activity.purchaseOrderNumber}`,
          description: `${activity.quantity} x ${activity.asset?.name || 'item'}`,
          date: new Date(activity.purchaseDate).toLocaleDateString(),
          status: activity.status
        };
      case 'transfer':
        return {
          title: `Transfer to ${activity.toBase?.name}`,
          description: `${activity.quantity} x ${activity.asset?.name || 'item'} from ${activity.fromBase?.name}`,
          date: new Date(activity.requestDate).toLocaleDateString(),
          status: activity.status
        };
      case 'assignment':
        return {
          title: `Assigned to ${activity.assignedTo?.lastName}`,
          description: `${activity.quantity} x ${activity.asset?.name || 'item'}`,
          date: new Date(activity.assignmentDate).toLocaleDateString(),
          status: activity.status
        };
      default:
        return { title: 'Unknown Activity', description: '', date: '', status: '' };
    }
  };

  const allActivities = [
    ...(activities?.purchases || []).map(p => ({ ...p, type: 'purchase' })),
    ...(activities?.transfers || []).map(t => ({ ...t, type: 'transfer' })),
    ...(activities?.assignments || []).map(a => ({ ...a, type: 'assignment' }))
  ].sort((a, b) => new Date(b.createdAt || b.purchaseDate || b.requestDate || b.assignmentDate) - 
                   new Date(a.createdAt || a.purchaseDate || a.requestDate || a.assignmentDate));

  return (
    <div className="bg-white p-6 rounded-lg shadow-md h-full">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Activities</h3>
      
      {allActivities.length === 0 ? (
        <div className="flex items-center justify-center h-full text-gray-500">
          <CheckCircleIcon className="h-10 w-10 mr-4" />
          <div>
            <p className="text-lg font-medium">All caught up!</p>
            <p className="text-sm">No new activities to report.</p>
          </div>
        </div>
      ) : (
        <motion.ul 
          className="space-y-4"
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.05 } }
          }}
        >
          {allActivities.slice(0, 7).map((activity) => {
            const { Icon, color } = getActivityIconAndColor(activity.type, activity.status);
            const formatted = formatActivity(activity, activity.type);
            
            return (
              <motion.li 
                key={`${activity.type}-${activity._id}`}
                className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                variants={{
                  hidden: { y: 20, opacity: 0 },
                  visible: { y: 0, opacity: 1 }
                }}
              >
                <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${color}`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{formatted.title}</p>
                  <p className="text-sm text-gray-500 truncate">{formatted.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-600">{formatted.date}</p>
                  <span className="text-xs font-semibold px-2 py-1 rounded-full bg-gray-100 text-gray-600 capitalize">
                    {formatted.status?.replace('_', ' ')}
                  </span>
                </div>
              </motion.li>
            );
          })}
        </motion.ul>
      )}
    </div>
  );
};

export default RecentActivities;
