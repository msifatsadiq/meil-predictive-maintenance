import { useState, useEffect } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getMachines, getEvents, getWorkOrders } from '../firebase/firestore';
import { 
  calculateTotalDowntime, 
  getDowntimeByDay, 
  getRecentEvents,
  getMachineStatusDistribution 
} from '../utils/kpiCalculations';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [machines, setMachines] = useState([]);
  const [events, setEvents] = useState([]);
  const [workOrders, setWorkOrders] = useState([]);
  
  const [stats, setStats] = useState({
    totalMachines: 0,
    running: 0,
    stopped: 0,
    totalDowntime: '0h 0m',
    openWorkOrders: 0
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [machinesData, eventsData, workOrdersData] = await Promise.all([
        getMachines(),
        getEvents(),
        getWorkOrders()
      ]);

      setMachines(machinesData);
      setEvents(eventsData);
      setWorkOrders(workOrdersData);

      // Calculate stats
      const recentEvents = getRecentEvents(eventsData, 7);
      const downtime = calculateTotalDowntime(recentEvents);
      const running = machinesData.filter(m => m.status === 'Running').length;
      const stopped = machinesData.filter(m => m.status !== 'Running').length;
      const openWO = workOrdersData.filter(wo => wo.status === 'Open').length;

      setStats({
        totalMachines: machinesData.length,
        running,
        stopped,
        totalDowntime: downtime.formatted,
        openWorkOrders: openWO
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Prepare chart data
  const downtimeByDay = getDowntimeByDay(getRecentEvents(events, 7), 7);
  const statusDistribution = getMachineStatusDistribution(machines);
  
  const pieData = Object.entries(statusDistribution).map(([name, value]) => ({
    name,
    value
  }));

  const COLORS = {
    'Running': '#10b981',
    'Stopped': '#ef4444',
    'Faulted': '#f59e0b',
    'Under Maintenance': '#3b82f6'
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Dashboard Overview
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Real-time insights into your maintenance operations
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Machines</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalMachines}</p>
            </div>
            <div className="text-4xl">⚙️</div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Machines Running</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.running}</p>
            </div>
            <div className="text-4xl">✅</div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Machines Stopped</p>
              <p className="text-3xl font-bold text-red-600 dark:text-red-400">{stats.stopped}</p>
            </div>
            <div className="text-4xl">⛔</div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Downtime (7d)</p>
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{stats.totalDowntime}</p>
            </div>
            <div className="text-4xl">⏱️</div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Open Work Orders</p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.openWorkOrders}</p>
            </div>
            <div className="text-4xl">🔧</div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Downtime by Day */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Downtime by Day (Last 7 Days)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={downtimeByDay}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis label={{ value: 'Hours', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="downtime" fill="#f59e0b" name="Downtime (hours)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Machine Status Distribution */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Machine Status Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#94a3b8'} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Events */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recent Downtime Events
          </h3>
          <div className="space-y-3">
            {events.slice(0, 5).map((event) => {
              const machine = machines.find(m => m.id === event.machineId);
              return (
                <div key={event.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {machine?.name || 'Unknown Machine'}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {event.category} - {event.reason}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-orange-600 dark:text-orange-400">
                      {Math.round(event.downtimeMinutes || 0)} min
                    </p>
                  </div>
                </div>
              );
            })}
            {events.length === 0 && (
              <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                No recent events
              </p>
            )}
          </div>
        </div>

        {/* Recent Work Orders */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recent Work Orders
          </h3>
          <div className="space-y-3">
            {workOrders.slice(0, 5).map((wo) => {
              const machine = machines.find(m => m.id === wo.machineId);
              return (
                <div key={wo.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {wo.title}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {machine?.name || 'Unknown Machine'}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs px-2 py-1 rounded ${
                      wo.status === 'Open' ? 'bg-yellow-100 text-yellow-800' :
                      wo.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {wo.status}
                    </span>
                  </div>
                </div>
              );
            })}
            {workOrders.length === 0 && (
              <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                No recent work orders
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
