import * as os from 'os';
import * as process from 'process';
import { Injectable } from '@nestjs/common';
import { formatUptime, bytesToMB } from './utils/common-methods';
import type { ServerStatus } from './common/interfaces/server-status.interface';

@Injectable()
export class AppService {
  private readonly serverStartTime = new Date();
  private requestsServed = 0;

  incrementRequestCount() {
    this.requestsServed++;
  }

  getServerStatus(): ServerStatus {
    const mem = process.memoryUsage();

    return {
      message: '🧠 NeuraLens Backend Server is up and running!',
      timestamp: new Date().toISOString(),
      uptime: formatUptime(process.uptime()),
      pid: process.pid,
      nodeVersion: process.version,
      platform: `${os.type()} ${os.release()}`,
      memory: {
        rss: bytesToMB(mem.rss),          // Resident Set Size in MB
        heapUsed: bytesToMB(mem.heapUsed),// Heap Used in MB
        heapTotal: bytesToMB(mem.heapTotal),
        external: bytesToMB(mem.external ?? 0),
      },
      cpu: {
        cores: os.cpus().length,
        loadAvg: os.loadavg(), // 1, 5, 15 min averages
      },
      analytics: {
        requestsServed: this.requestsServed,
        lastRestart: this.serverStartTime.toISOString(),
      },
    };
  }
}
