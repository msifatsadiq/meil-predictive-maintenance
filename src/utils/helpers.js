/**
 * Get status badge color classes
 */
export const getStatusColor = (status) => {
  const colors = {
    'Running': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'Stopped': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    'Faulted': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    'Under Maintenance': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'Open': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    'In Progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'Closed': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
  };
  return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
};

/**
 * Get priority badge color classes
 */
export const getPriorityColor = (priority) => {
  const colors = {
    'High': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    'Medium': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    'Low': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  };
  return colors[priority] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
};

/**
 * Get criticality badge color classes
 */
export const getCriticalityColor = (criticality) => {
  const colors = {
    'High': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    'Medium': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    'Low': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  };
  return colors[criticality] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
};
