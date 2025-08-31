export interface ServerStatus {
  message: string;
  timestamp: string;
  uptime: string;
  pid: number;
  nodeVersion: string;
  platform: string;
  memory: {
    rss: string;      // Resident Set Size in MB
    heapUsed: string; // Heap Used in MB
    heapTotal: string; // Total Heap allocated
    external: string; // External memory (e.g. C++ bindings)
  };
  cpu: {
    cores: number;
    loadAvg: number[]; // [1min, 5min, 15min]
  };
  analytics: {
    requestsServed: number;
    lastRestart: string;
  };
}
