import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useAppStore } from '../store/appStore';

const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuthStore();
  const { sidebarOpen } = useAppStore();

  const navigation = [
    { name: 'Dashboard', path: '/dashboard', icon: '📊', roles: ['admin', 'engineer', 'viewer'] },
    { name: 'Machines', path: '/machines', icon: '⚙️', roles: ['admin', 'engineer', 'viewer'] },
    { name: 'Events', path: '/events', icon: '📋', roles: ['admin', 'engineer', 'viewer'] },
    { name: 'Work Orders', path: '/workorders', icon: '🔧', roles: ['admin', 'engineer', 'viewer'] },
  ];

  const filteredNav = navigation.filter(item => 
    item.roles.includes(user?.role || 'viewer')
  );

  if (!sidebarOpen) return null;

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 min-h-screen">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="text-3xl">🏭</div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">MEIL</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Maintenance Dashboard</p>
          </div>
        </div>

        <nav className="space-y-2">
          {filteredNav.map((item) => {
            const isActive = location.pathname === item.path || 
                           (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Info */}
      <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
            <span className="text-primary-600 dark:text-primary-400 font-semibold">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {user?.name || 'User'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
              {user?.role || 'viewer'}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
