import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMachine, getEvents, getWorkOrders } from '../firebase/firestore';
import { 
  calculateMTBF, 
  calculateMTTR, 
  calculateTotalDowntime,
  formatTimestamp,
  formatDuration 
} from '../utils/kpiCalculations';
import { getStatusColor, getCriticalityColor } from '../utils/helpers';

const MachineDetail = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [machine, setMachine] = useState(null);
  const [events, setEvents] = useState([]);
  const [workOrders, setWorkOrders] = useState([]);
  const [kpis, setKpis] = useState({
    mtbf: 0,
    mttr: 0,
    totalDowntime: '0h 0m',
    numberOfFailures: 0
  });

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [machineData, eventsData, workOrdersData] = await Promise.all([
        getMachine(id),
        getEvents({ machineId: id }),
        getWorkOrders({ machineId: id })
      ]);

      if (!machineData) {
        alert('Machine not found');
        return;
      }

      setMachine(machineData);
      setEvents(eventsData);
      setWorkOrders(workOrdersData);

      // Calculate KPIs
      const mtbf = calculateMTBF(eventsData);
      const mttr = calculateMTTR(eventsData);
      const downtime = calculateTotalDowntime(eventsData);

      setKpis({
        mtbf: mtbf.toFixed(2),
        mttr: mttr.toFixed(2),
        totalDowntime: downtime.formatted,
        numberOfFailures: eventsData.length
      });
    } catch (error) {
      console.error('Error loading machine details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading machine details...</p>
        </div>
      </div>
    );
  }

  if (!machine) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">Machine not found</p>
        <Link to="/machines" className="text-primary-600 hover:text-primary-700 mt-4 inline-block">
          Back to Machines
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link to="/machines" className="text-primary-600 hover:text-primary-700 text-sm mb-2 inline-block">
            ← Back to Machines
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{machine.name}</h1>
          <p className="text-gray-600 dark:text-gray-400">Asset Code: {machine.assetCode}</p>
        </div>
        <div className="text-right">
          <span className={`px-3 py-1 text-sm font-medium rounded ${getStatusColor(machine.status)}`}>
            {machine.status}
          </span>
        </div>
      </div>

      {/* Machine Info Card */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Machine Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Line</p>
            <p className="text-lg font-medium text-gray-900 dark:text-white">{machine.line}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Asset Code</p>
            <p className="text-lg font-medium text-gray-900 dark:text-white">{machine.assetCode}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Status</p>
            <span className={`px-2 py-1 text-sm font-medium rounded ${getStatusColor(machine.status)}`}>
              {machine.status}
            </span>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Criticality</p>
            <span className={`px-2 py-1 text-sm font-medium rounded ${getCriticalityColor(machine.criticality)}`}>
              {machine.criticality}
            </span>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">MTBF</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{kpis.mtbf}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">hours</p>
        </div>

        <div className="card">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">MTTR</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{kpis.mttr}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">hours</p>
        </div>

        <div className="card">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Downtime</p>
          <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{kpis.totalDowntime}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">all time</p>
        </div>

        <div className="card">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Number of Failures</p>
          <p className="text-3xl font-bold text-red-600 dark:text-red-400">{kpis.numberOfFailures}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">events</p>
        </div>
      </div>

      {/* Recent Events and Work Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Downtime Events */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Downtime Events
            </h3>
            <Link to="/events" className="text-sm text-primary-600 hover:text-primary-700">
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {events.slice(0, 5).map((event) => (
              <div key={event.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {event.category}
                  </span>
                  <span className="text-sm font-medium text-orange-600 dark:text-orange-400">
                    {formatDuration(event.downtimeMinutes)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{event.reason}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {formatTimestamp(event.startTime)}
                </p>
              </div>
            ))}
            {events.length === 0 && (
              <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                No downtime events recorded
              </p>
            )}
          </div>
        </div>

        {/* Recent Work Orders */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Work Orders
            </h3>
            <Link to="/workorders" className="text-sm text-primary-600 hover:text-primary-700">
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {workOrders.slice(0, 5).map((wo) => (
              <div key={wo.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {wo.title}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    wo.status === 'Open' ? 'bg-yellow-100 text-yellow-800' :
                    wo.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {wo.status}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-xs px-2 py-1 rounded ${
                    wo.priority === 'High' ? 'bg-red-100 text-red-800' :
                    wo.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {wo.priority} Priority
                  </span>
                  {wo.assignedTo && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Assigned to: {wo.assignedTo}
                    </span>
                  )}
                </div>
              </div>
            ))}
            {workOrders.length === 0 && (
              <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                No work orders found
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MachineDetail;
