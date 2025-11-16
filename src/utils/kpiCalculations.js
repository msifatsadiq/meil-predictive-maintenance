import { subDays, startOfDay, endOfDay, format } from 'date-fns';

/**
 * Calculate Mean Time Between Failures (MTBF)
 * MTBF = Total Operating Time / Number of Failures
 * 
 * @param {Array} events - Array of downtime events
 * @param {number} totalOperatingHours - Total hours the machine was operational
 * @returns {number} MTBF in hours
 */
export const calculateMTBF = (events, totalOperatingHours = 720) => {
  if (!events || events.length === 0) return totalOperatingHours;
  
  const numberOfFailures = events.length;
  const totalDowntimeHours = events.reduce((sum, event) => {
    return sum + (event.downtimeMinutes || 0) / 60;
  }, 0);
  
  const actualOperatingTime = totalOperatingHours - totalDowntimeHours;
  const mtbf = actualOperatingTime / numberOfFailures;
  
  return Math.round(mtbf * 100) / 100;
};

/**
 * Calculate Mean Time To Repair (MTTR)
 * MTTR = Total Downtime / Number of Failures
 * 
 * @param {Array} events - Array of downtime events
 * @returns {number} MTTR in hours
 */
export const calculateMTTR = (events) => {
  if (!events || events.length === 0) return 0;
  
  const totalDowntimeMinutes = events.reduce((sum, event) => {
    return sum + (event.downtimeMinutes || 0);
  }, 0);
  
  const mttr = (totalDowntimeMinutes / events.length) / 60;
  return Math.round(mttr * 100) / 100;
};

/**
 * Calculate total downtime for a period
 * 
 * @param {Array} events - Array of downtime events
 * @returns {Object} { minutes, hours, formatted }
 */
export const calculateTotalDowntime = (events) => {
  if (!events || events.length === 0) {
    return { minutes: 0, hours: 0, formatted: '0h 0m' };
  }
  
  const totalMinutes = events.reduce((sum, event) => {
    return sum + (event.downtimeMinutes || 0);
  }, 0);
  
  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.round(totalMinutes % 60);
  
  return {
    minutes: totalMinutes,
    hours: totalMinutes / 60,
    formatted: `${hours}h ${minutes}m`
  };
};

/**
 * Calculate availability percentage
 * Availability = (Total Time - Downtime) / Total Time * 100
 * 
 * @param {Array} events - Array of downtime events
 * @param {number} totalHours - Total hours in period (default: 720 hours = 30 days)
 * @returns {number} Availability percentage
 */
export const calculateAvailability = (events, totalHours = 720) => {
  const downtime = calculateTotalDowntime(events);
  const downtimeHours = downtime.hours;
  
  const availability = ((totalHours - downtimeHours) / totalHours) * 100;
  return Math.round(availability * 100) / 100;
};

/**
 * Group events by day and calculate daily downtime
 * 
 * @param {Array} events - Array of downtime events
 * @param {number} days - Number of days to look back (default: 7)
 * @returns {Array} Array of { date, downtime } objects
 */
export const getDowntimeByDay = (events, days = 7) => {
  const now = new Date();
  const daysArray = [];
  
  // Initialize array with all days
  for (let i = days - 1; i >= 0; i--) {
    const date = subDays(now, i);
    daysArray.push({
      date: format(date, 'MMM dd'),
      fullDate: date,
      downtime: 0,
      count: 0
    });
  }
  
  // Group events by day
  if (events && events.length > 0) {
    events.forEach(event => {
      if (!event.startTime) return;
      
      const eventDate = event.startTime.toDate ? event.startTime.toDate() : new Date(event.startTime);
      
      // Find matching day
      const dayIndex = daysArray.findIndex(day => {
        const dayStart = startOfDay(day.fullDate);
        const dayEnd = endOfDay(day.fullDate);
        return eventDate >= dayStart && eventDate <= dayEnd;
      });
      
      if (dayIndex !== -1) {
        daysArray[dayIndex].downtime += event.downtimeMinutes || 0;
        daysArray[dayIndex].count += 1;
      }
    });
  }
  
  // Convert to hours and round
  return daysArray.map(day => ({
    date: day.date,
    downtime: Math.round((day.downtime / 60) * 10) / 10,
    count: day.count
  }));
};

/**
 * Get events for last N days
 * 
 * @param {Array} events - Array of all events
 * @param {number} days - Number of days to filter (default: 7)
 * @returns {Array} Filtered events
 */
export const getRecentEvents = (events, days = 7) => {
  if (!events || events.length === 0) return [];
  
  const cutoffDate = subDays(new Date(), days);
  
  return events.filter(event => {
    if (!event.startTime) return false;
    const eventDate = event.startTime.toDate ? event.startTime.toDate() : new Date(event.startTime);
    return eventDate >= cutoffDate;
  });
};

/**
 * Calculate machine status distribution
 * 
 * @param {Array} machines - Array of machines
 * @returns {Object} Status counts
 */
export const getMachineStatusDistribution = (machines) => {
  if (!machines || machines.length === 0) {
    return {
      Running: 0,
      Stopped: 0,
      Faulted: 0,
      'Under Maintenance': 0
    };
  }
  
  const distribution = machines.reduce((acc, machine) => {
    const status = machine.status || 'Stopped';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});
  
  return distribution;
};

/**
 * Format timestamp to readable string
 * 
 * @param {*} timestamp - Firebase timestamp or Date
 * @returns {string} Formatted date string
 */
export const formatTimestamp = (timestamp) => {
  if (!timestamp) return 'N/A';
  
  try {
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return format(date, 'MMM dd, yyyy HH:mm');
  } catch (error) {
    return 'Invalid date';
  }
};

/**
 * Format duration in minutes to readable string
 * 
 * @param {number} minutes - Duration in minutes
 * @returns {string} Formatted duration
 */
export const formatDuration = (minutes) => {
  if (!minutes || minutes === 0) return '0m';
  
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
};
