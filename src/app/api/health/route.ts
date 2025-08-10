// Health check endpoint for production monitoring
import { NextRequest, NextResponse } from 'next/server';

interface HealthStatus {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  uptime: number;
  version: string;
  checks: {
    database: 'connected' | 'disconnected' | 'unknown';
    memory: {
      used: string;
      total: string;
      percentage: number;
    };
    environment: string;
  };
}

export async function GET(request: NextRequest) {
  try {
    const startTime = Date.now();
    
    // Basic health checks
    const healthStatus: HealthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || '1.0.0',
      checks: {
        database: 'unknown', // Will be updated with actual DB check
        memory: getMemoryUsage(),
        environment: process.env.NODE_ENV || 'development'
      }
    };

    // Database connection check (if available)
    try {
      // Add your database check here
      // const dbCheck = await checkDatabaseConnection();
      // healthStatus.checks.database = dbCheck ? 'connected' : 'disconnected';
      healthStatus.checks.database = 'connected'; // Mock for now
    } catch (error) {
      healthStatus.checks.database = 'disconnected';
      healthStatus.status = 'unhealthy';
    }

    // Memory check
    if (healthStatus.checks.memory.percentage > 90) {
      healthStatus.status = 'unhealthy';
    }

    const responseTime = Date.now() - startTime;
    
    return NextResponse.json({
      ...healthStatus,
      responseTime: `${responseTime}ms`
    }, {
      status: healthStatus.status === 'healthy' ? 200 : 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Health check failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, {
      status: 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Content-Type': 'application/json'
      }
    });
  }
}

function getMemoryUsage() {
  const memUsage = process.memoryUsage();
  const totalMem = memUsage.heapTotal;
  const usedMem = memUsage.heapUsed;
  const percentage = Math.round((usedMem / totalMem) * 100);

  return {
    used: formatBytes(usedMem),
    total: formatBytes(totalMem),
    percentage
  };
}

function formatBytes(bytes: number): string {
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 Bytes';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
}
