import { useState, useEffect } from 'react';
import { getMachines, getWorkOrders, addWorkOrder, updateWorkOrder, deleteWorkOrder } from '../firebase/firestore';
import { useAuthStore } from '../store/authStore';
import { getPriorityColor, getStatusColor } from '../utils/helpers';
import { formatTimestamp } from '../utils/kpiCalculations';

const WorkOrders = () => {
  const { user } = useAuthStore();
  const [machines, setMachines] = useState([]);
  const [workOrders, setWorkOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [editingWorkOrder, setEditingWorkOrder] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    machineId: '',
    priority: 'Medium',
    status: 'Open',
    dueDate: '',
    assignedTo: '',
    description: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [machinesData, workOrdersData] = await Promise.all([
        getMachines(),
        getWorkOrders()
      ]);
      setMachines(machinesData);
      setWorkOrders(workOrdersData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingWorkOrder) {
        await updateWorkOrder(editingWorkOrder.id, formData);
      } else {
        await addWorkOrder(formData);
      }
      
      await loadData();
      resetForm();
    } catch (error) {
      console.error('Error saving work order:', error);
      alert('Failed to save work order. Please try again.');
    }
  };

  const handleEdit = (workOrder) => {
    setEditingWorkOrder(workOrder);
    
    // Convert Firestore timestamp to date input format
    let dueDate = '';
    if (workOrder.dueDate) {
      const date = workOrder.dueDate.toDate ? workOrder.dueDate.toDate() : new Date(workOrder.dueDate);
      dueDate = date.toISOString().slice(0, 10);
    }
    
    setFormData({
      title: workOrder.title,
      machineId: workOrder.machineId,
      priority: workOrder.priority,
      status: workOrder.status,
      dueDate,
      assignedTo: workOrder.assignedTo || '',
      description: workOrder.description || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this work order?')) return;
    
    try {
      await deleteWorkOrder(id);
      await loadData();
    } catch (error) {
      console.error('Error deleting work order:', error);
      alert('Failed to delete work order. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      machineId: '',
      priority: 'Medium',
      status: 'Open',
      dueDate: '',
      assignedTo: '',
      description: ''
    });
    setEditingWorkOrder(null);
    setShowModal(false);
  };

  // Filter work orders
  const filteredWorkOrders = workOrders.filter(wo => {
    const matchesStatus = filterStatus === 'All' || wo.status === filterStatus;
    const matchesPriority = filterPriority === 'All' || wo.priority === filterPriority;
    return matchesStatus && matchesPriority;
  });

  const canEdit = user?.role === 'admin' || user?.role === 'engineer';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading work orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Work Orders</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage maintenance work orders</p>
        </div>
        {canEdit && (
          <button onClick={() => setShowModal(true)} className="btn-primary">
            + Create Work Order
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Filter by Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input"
            >
              <option value="All">All Status</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
          <div>
            <label className="label">Filter by Priority</label>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="input"
            >
              <option value="All">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Work Orders Table */}
      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Machine
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Assigned To
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredWorkOrders.map((wo) => {
                const machine = machines.find(m => m.id === wo.machineId);
                return (
                  <tr key={wo.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {wo.title}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {machine?.name || 'Unknown'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${getPriorityColor(wo.priority)}`}>
                        {wo.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(wo.status)}`}>
                        {wo.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {wo.dueDate ? formatTimestamp(wo.dueDate) : 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {wo.assignedTo || 'Unassigned'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                      {canEdit && (
                        <>
                          <button
                            onClick={() => handleEdit(wo)}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(wo.id)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          {filteredWorkOrders.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">No work orders found</p>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {editingWorkOrder ? 'Edit Work Order' : 'Create New Work Order'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="input"
                  placeholder="Brief description of the work"
                  required
                />
              </div>

              <div>
                <label className="label">Machine</label>
                <select
                  value={formData.machineId}
                  onChange={(e) => setFormData({ ...formData, machineId: e.target.value })}
                  className="input"
                  required
                >
                  <option value="">Select a machine</option>
                  {machines.map((machine) => (
                    <option key={machine.id} value={machine.id}>
                      {machine.name} ({machine.assetCode})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="input"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div>
                  <label className="label">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="input"
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Due Date</label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">Assigned To</label>
                  <input
                    type="text"
                    value={formData.assignedTo}
                    onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                    className="input"
                    placeholder="Technician name"
                  />
                </div>
              </div>

              <div>
                <label className="label">Description (Optional)</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input"
                  rows="4"
                  placeholder="Detailed description of the work to be done..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button type="submit" className="btn-primary flex-1">
                  {editingWorkOrder ? 'Update' : 'Create'} Work Order
                </button>
                <button type="button" onClick={resetForm} className="btn-secondary flex-1">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkOrders;
