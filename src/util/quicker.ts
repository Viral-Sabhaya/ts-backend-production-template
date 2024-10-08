import os from 'os';
import config from '../config/config';

export default {
  // Function to get system-level health metrics
  getSystemHealth: () => {
    return {
      cpuUsage: os.loadavg(),
      totalMemory: `${(os.totalmem() / 1024 / 1024).toFixed(2)} MB`,
      freeMemory: `${(os.freemem() / 1024 / 1024).toFixed(2)} MB`
    };
  },

  // Function to get application-level health metrics
  getApplicationHealth: () => {
    return {
      environment: config.env,
      uptime: `${process.uptime().toFixed(2)} Seconds`,
      memoryUsage: {
        heapTotal: `${(process.memoryUsage().heapTotal / 1024 / 1024).toFixed(2)} MB`,
        heapUsed: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`
      }
    };
  }
};
