import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Bars3Icon,
  BellIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';

const Header = ({ setSidebarOpen, user }) => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  // Function to get user initials
  const getInitials = (firstName, lastName) => {
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`;
    }
    return user?.username?.[0] || 'U';
  };

  return (
    <div className="relative z-10 flex-shrink-0 flex h-16 bg-white border-b border-gray-200">
      {/* Mobile menu button */}
      <button
        type="button"
        className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
        onClick={() => setSidebarOpen(true)}
      >
        <span className="sr-only">Open sidebar</span>
        <Bars3Icon className="h-6 w-6" />
      </button>

      <div className="flex-1 px-4 flex justify-between">
        {/* Left side - could add search or breadcrumbs here */}
        <div className="flex-1 flex items-center">
          <h1 className="text-xl font-semibold text-gray-800">
            {/* This could be dynamic based on the page */}
            Dashboard
          </h1>
        </div>

        {/* Right side */}
        <div className="ml-4 flex items-center md:ml-6">
          {/* Notifications button */}
          <button
            type="button"
            className="p-1 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            <span className="sr-only">View notifications</span>
            <BellIcon className="h-6 w-6" />
          </button>

          {/* Profile dropdown */}
          <Menu as="div" className="ml-3 relative">
            <div>
              <Menu.Button className="max-w-xs flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-1 hover:bg-gray-100 transition-colors">
                <span className="sr-only">Open user menu</span>
                <div className="h-9 w-9 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                  {getInitials(user?.firstName, user?.lastName)}
                </div>
                <div className="ml-3 hidden md:block text-left">
                  <div className="text-sm font-medium text-gray-800">
                    {user?.fullName || `${user?.firstName} ${user?.lastName}`}
                  </div>
                  <div className="text-xs text-gray-500 capitalize">
                    {user?.role?.replace('_', ' ')}
                  </div>
                </div>
                <ChevronDownIcon className="ml-2 h-5 w-5 text-gray-400 hidden md:block" />
              </Menu.Button>
            </div>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="px-4 py-3 border-b border-gray-200">
                  <div className="text-sm font-semibold text-gray-900 truncate">
                    {user?.fullName || `${user?.firstName} ${user?.lastName}`}
                  </div>
                  <div className="text-sm text-gray-500 truncate">{user?.email}</div>
                </div>
                
                <div className="py-1">
                  <div className="px-4 py-2 text-xs text-gray-500">
                    <p className="font-medium">{user?.rank}</p>
                    {user?.assignedBase && (
                      <p>{user.assignedBase.name}</p>
                    )}
                  </div>
                </div>

                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={handleLogout}
                      className={`${
                        active ? 'bg-gray-100' : ''
                      } group flex w-full items-center px-4 py-2 text-sm text-gray-700`}
                    >
                      <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                      Sign out
                    </button>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    </div>
  );
};

export default Header;
