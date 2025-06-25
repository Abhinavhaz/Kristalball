import { useState } from 'react';
import { format } from 'date-fns';

const FiltersPanel = ({ filters, onFilterChange, userRole, userBase }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const assetTypes = [
    { value: '', label: 'All Asset Types' },
    { value: 'vehicle', label: 'Vehicles' },
    { value: 'weapon', label: 'Weapons' },
    { value: 'ammunition', label: 'Ammunition' },
    { value: 'equipment', label: 'Equipment' },
    { value: 'supplies', label: 'Supplies' }
  ];

  // Mock bases data - in real app, this would come from API
  const bases = [
    { value: '', label: 'All Bases' },
    { value: '1', label: 'Fort Liberty (FL001)' },
    { value: '2', label: 'Camp Pendleton (CP002)' },
    { value: '3', label: 'Joint Base Lewis-McChord (JBLM003)' }
  ];

  const handleFilterChange = (field, value) => {
    const newFilters = {
      ...localFilters,
      [field]: value
    };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleDateRangePreset = (preset) => {
    const today = new Date();
    let startDate, endDate;

    switch (preset) {
      case 'today':
        startDate = endDate = format(today, 'yyyy-MM-dd');
        break;
      case 'week':
        startDate = format(new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd');
        endDate = format(today, 'yyyy-MM-dd');
        break;
      case 'month':
        startDate = format(new Date(today.getFullYear(), today.getMonth(), 1), 'yyyy-MM-dd');
        endDate = format(today, 'yyyy-MM-dd');
        break;
      case 'quarter':
        const quarterStart = new Date(today.getFullYear(), Math.floor(today.getMonth() / 3) * 3, 1);
        startDate = format(quarterStart, 'yyyy-MM-dd');
        endDate = format(today, 'yyyy-MM-dd');
        break;
      default:
        return;
    }

    const newFilters = {
      ...localFilters,
      startDate,
      endDate
    };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      baseId: '',
      assetType: '',
      startDate: '',
      endDate: ''
    };
    setLocalFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  return (
    <div className="card p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Filters</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Base Filter - Only show for admin users */}
        {userRole === 'admin' && (
          <div>
            <label htmlFor="baseId" className="block text-sm font-medium text-gray-700 mb-1">
              Base
            </label>
            <select
              id="baseId"
              value={localFilters.baseId}
              onChange={(e) => handleFilterChange('baseId', e.target.value)}
              className="input-field"
            >
              {bases.map((base) => (
                <option key={base.value} value={base.value}>
                  {base.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Asset Type Filter */}
        <div>
          <label htmlFor="assetType" className="block text-sm font-medium text-gray-700 mb-1">
            Asset Type
          </label>
          <select
            id="assetType"
            value={localFilters.assetType}
            onChange={(e) => handleFilterChange('assetType', e.target.value)}
            className="input-field"
          >
            {assetTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Start Date */}
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
            Start Date
          </label>
          <input
            type="date"
            id="startDate"
            value={localFilters.startDate}
            onChange={(e) => handleFilterChange('startDate', e.target.value)}
            className="input-field"
          />
        </div>

        {/* End Date */}
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
            End Date
          </label>
          <input
            type="date"
            id="endDate"
            value={localFilters.endDate}
            onChange={(e) => handleFilterChange('endDate', e.target.value)}
            className="input-field"
          />
        </div>
      </div>

      {/* Quick Date Presets */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Quick Date Ranges
        </label>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleDateRangePreset('today')}
            className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            Today
          </button>
          <button
            onClick={() => handleDateRangePreset('week')}
            className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            Last 7 Days
          </button>
          <button
            onClick={() => handleDateRangePreset('month')}
            className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            This Month
          </button>
          <button
            onClick={() => handleDateRangePreset('quarter')}
            className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            This Quarter
          </button>
          <button
            onClick={clearFilters}
            className="px-3 py-1 text-xs bg-red-100 hover:bg-red-200 text-red-700 rounded-md transition-colors"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Current User Info */}
      {userRole !== 'admin' && userBase && (
        <div className="mt-4 p-3 bg-blue-50 rounded-md">
          <p className="text-sm text-blue-800">
            <span className="font-medium">Note:</span> You are viewing data for {userBase.name} ({userBase.code}) only.
          </p>
        </div>
      )}
    </div>
  );
};

export default FiltersPanel;
