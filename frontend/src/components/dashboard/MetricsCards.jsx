import { 
  CubeIcon, 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon,
  UserGroupIcon,
  FireIcon,
  BanknotesIcon,
  ReceiptRefundIcon
} from '@heroicons/react/24/outline';

const MetricsCards = ({ metrics }) => {
  if (!metrics) return null;

  const cards = [
    {
      title: 'Opening Balance',
      value: metrics.openingBalance.toLocaleString(),
      icon: BanknotesIcon,
      color: 'bg-blue-500',
      description: 'Value at start of period'
    },
    {
      title: 'Closing Balance',
      value: metrics.closingBalance.toLocaleString(),
      icon: BanknotesIcon,
      color: 'bg-green-500',
      description: 'Value at end of period'
    },
    {
      title: 'Net Movement',
      value: metrics.netMovement.toLocaleString(),
      icon: metrics.netMovement >= 0 ? ArrowTrendingUpIcon : ArrowTrendingDownIcon,
      color: metrics.netMovement >= 0 ? 'bg-emerald-500' : 'bg-rose-500',
      description: 'Change in stock value'
    },
    {
      title: 'Current Stock',
      value: metrics.currentStock.toLocaleString(),
      icon: CubeIcon,
      color: 'bg-purple-500',
      description: 'Total available units'
    },
    {
      title: 'Total Assigned',
      value: metrics.totalAssigned.toLocaleString(),
      icon: UserGroupIcon,
      color: 'bg-orange-500',
      description: 'Units assigned to personnel'
    },
    {
      title: 'Total Expended',
      value: metrics.totalExpended.toLocaleString(),
      icon: ReceiptRefundIcon,
      color: 'bg-red-500',
      description: 'Consumed or decommissioned'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`bg-white p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${card.clickable ? 'cursor-pointer' : ''}`}
          onClick={card.clickable ? card.onClick : undefined}
        >
          <div className="flex justify-between items-start">
            <div className="flex flex-col">
              <p className="text-sm text-gray-500">{card.title}</p>
              <p className="text-3xl font-bold text-gray-800">{card.value}</p>
              <p className="text-xs text-gray-400 mt-1">{card.description}</p>
            </div>
            <div className={`p-3 rounded-full ${card.color}`}>
              <card.icon className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MetricsCards;
