import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Link, useLocation } from 'react-router-dom';
import {
  XMarkIcon,
  HomeIcon,
  ShoppingCartIcon,
  ArrowsRightLeftIcon,
  UserGroupIcon,
  CubeIcon,
  BuildingOfficeIcon,
  ClipboardDocumentListIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

const Sidebar = ({ sidebarOpen, setSidebarOpen, userRole }) => {
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon, roles: ['admin', 'base_commander', 'logistics_officer'] },
    { name: 'Purchases', href: '/purchases', icon: ShoppingCartIcon, roles: ['admin', 'base_commander', 'logistics_officer'] },
    { name: 'Transfers', href: '/transfers', icon: ArrowsRightLeftIcon, roles: ['admin', 'base_commander', 'logistics_officer'] },
    { name: 'Assignments', href: '/assignments', icon: UserGroupIcon, roles: ['admin', 'base_commander', 'logistics_officer'] },
    { name: 'Assets', href: '/assets', icon: CubeIcon, roles: ['admin', 'base_commander'] },
    { name: 'Bases', href: '/bases', icon: BuildingOfficeIcon, roles: ['admin'] },
    { name: 'Inventory', href: '/inventory', icon: ClipboardDocumentListIcon, roles: ['admin', 'base_commander', 'logistics_officer'] }
  ];

  const filteredNavigation = navigation.filter(item => 
    item.roles.includes(userRole)
  );

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-gray-800 text-gray-100">
      {/* Logo */}
      <div className="flex items-center justify-center h-20 flex-shrink-0">
        <div className="flex items-center">
          <ShieldCheckIcon className="h-10 w-10 text-indigo-400" />
          <span className="ml-3 text-white font-semibold text-xl">Kristalball</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-5 flex-1 px-2 space-y-1">
        {filteredNavigation.map((item) => {
          const isActive = location.pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`
                group flex items-center px-3 py-3 text-sm font-medium rounded-md transition-all duration-200
                ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }
              `}
            >
              <item.icon
                className={`
                  mr-3 flex-shrink-0 h-6 w-6 transition-all duration-200
                  ${
                    isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-300'
                  }
                `}
              />
              <span className="flex-1">{item.name}</span>
              {isActive && (
                <span className="ml-2 w-2 h-2 rounded-full bg-white animate-pulse"></span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Role Badge */}
      <div className="flex-shrink-0 p-4">
        <div className="text-center bg-gray-900 rounded-lg p-3">
          <div className="text-xs text-gray-400 uppercase tracking-wider">
            Role
          </div>
          <div className="text-sm text-white font-semibold capitalize">
            {userRole?.replace('_', ' ')}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile sidebar */}
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog as="div" className="relative z-40 md:hidden" onClose={setSidebarOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
          </Transition.Child>

          <div className="fixed inset-0 flex z-40">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative flex-1 flex flex-col max-w-xs w-full">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute top-0 right-0 -mr-12 pt-2">
                    <button
                      type="button"
                      className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <XMarkIcon className="h-6 w-6 text-white" />
                    </button>
                  </div>
                </Transition.Child>
                <SidebarContent />
              </Dialog.Panel>
            </Transition.Child>
            <div className="flex-shrink-0 w-14">{/* Force sidebar to shrink to fit close icon */}</div>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Static sidebar for desktop */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <SidebarContent />
      </div>
    </>
  );
};

export default Sidebar;
