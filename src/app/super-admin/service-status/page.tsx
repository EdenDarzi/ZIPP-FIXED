'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Activity, Server, Database, Wifi, Shield, Clock, AlertTriangle, CheckCircle, XCircle, RefreshCw, TrendingUp, Zap, Globe, HardDrive } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AutoTranslateText } from '@/components/translation/auto-translate-text';
import { useLanguage } from '@/context/language-context';

interface ServiceStatus {
  id: string;
  name: string;
  status: 'operational' | 'degraded' | 'outage' | 'maintenance';
  uptime: number;
  responseTime: number;
  lastChecked: string;
  description: string;
  icon: any;
}

interface SystemMetric {
  name: string;
  value: number;
  unit: string;
  status: 'good' | 'warning' | 'critical';
  threshold: number;
  icon: any;
}

interface IncidentReport {
  id: string;
  title: string;
  status: 'investigating' | 'identified' | 'monitoring' | 'resolved';
  severity: 'low' | 'medium' | 'high' | 'critical';
  startTime: string;
  resolvedTime?: string;
  description: string;
  affectedServices: string[];
}

const mockServices: ServiceStatus[] = [
  {
    id: '1',
    name: 'API Gateway',
    status: 'operational',
    uptime: 99.98,
    responseTime: 145,
    lastChecked: '2024-01-15 14:30:00',
    description: 'Main API gateway handling all requests',
    icon: Server
  },
  {
    id: '2',
    name: 'Database Primary',
    status: 'operational',
    uptime: 99.95,
    responseTime: 23,
    lastChecked: '2024-01-15 14:30:00',
    description: 'Primary PostgreSQL database',
    icon: Database
  },
  {
    id: '3',
    name: 'Redis Cache',
    status: 'degraded',
    uptime: 98.76,
    responseTime: 89,
    lastChecked: '2024-01-15 14:30:00',
    description: 'Redis caching layer',
    icon: Zap
  },
  {
    id: '4',
    name: 'CDN',
    status: 'operational',
    uptime: 99.99,
    responseTime: 67,
    lastChecked: '2024-01-15 14:30:00',
    description: 'Content delivery network',
    icon: Globe
  },
  {
    id: '5',
    name: 'Payment Gateway',
    status: 'operational',
    uptime: 99.92,
    responseTime: 234,
    lastChecked: '2024-01-15 14:30:00',
    description: 'Payment processing service',
    icon: Shield
  },
  {
    id: '6',
    name: 'File Storage',
    status: 'maintenance',
    uptime: 99.87,
    responseTime: 156,
    lastChecked: '2024-01-15 14:30:00',
    description: 'File storage and media service',
    icon: HardDrive
  },
  {
    id: '7',
    name: 'Notification Service',
    status: 'operational',
    uptime: 99.94,
    responseTime: 78,
    lastChecked: '2024-01-15 14:30:00',
    description: 'Push notifications and email service',
    icon: Wifi
  },
  {
    id: '8',
    name: 'Analytics Engine',
    status: 'operational',
    uptime: 99.89,
    responseTime: 312,
    lastChecked: '2024-01-15 14:30:00',
    description: 'Real-time analytics processing',
    icon: TrendingUp
  }
];

const mockSystemMetrics: SystemMetric[] = [
  {
    name: 'CPU Usage',
    value: 67,
    unit: '%',
    status: 'warning',
    threshold: 80,
    icon: Activity
  },
  {
    name: 'Memory Usage',
    value: 45,
    unit: '%',
    status: 'good',
    threshold: 85,
    icon: Server
  },
  {
    name: 'Disk Usage',
    value: 78,
    unit: '%',
    status: 'warning',
    threshold: 90,
    icon: HardDrive
  },
  {
    name: 'Network I/O',
    value: 234,
    unit: 'MB/s',
    status: 'good',
    threshold: 500,
    icon: Wifi
  }
];

const mockIncidents: IncidentReport[] = [
  {
    id: '1',
    title: 'Redis Cache Performance Degradation',
    status: 'monitoring',
    severity: 'medium',
    startTime: '2024-01-15 13:45:00',
    description: 'Experiencing slower response times from Redis cache cluster',
    affectedServices: ['Redis Cache', 'API Gateway']
  },
  {
    id: '2',
    title: 'Scheduled File Storage Maintenance',
    status: 'identified',
    severity: 'low',
    startTime: '2024-01-15 14:00:00',
    description: 'Planned maintenance for file storage system upgrade',
    affectedServices: ['File Storage']
  },
  {
    id: '3',
    title: 'Database Connection Pool Issue',
    status: 'resolved',
    severity: 'high',
    startTime: '2024-01-15 10:30:00',
    resolvedTime: '2024-01-15 11:15:00',
    description: 'Database connection pool reached maximum capacity',
    affectedServices: ['Database Primary', 'API Gateway']
  }
];

export default function ServiceStatusPage() {
  const { toast } = useToast();
  const { isRTL } = useLanguage();
  const [services, setServices] = useState(mockServices);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const handleRefreshStatus = async () => {
    setIsRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setIsRefreshing(false);
      setLastUpdate(new Date());
      toast({
        title: 'רענון סטטוס',
        description: 'סטטוס השירותים עודכן בהצלחה',
      });
    }, 2000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'degraded':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'outage':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'maintenance':
        return <Clock className="h-4 w-4 text-blue-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'operational':
        return <Badge className="bg-green-100 text-green-800 border-green-200">פעיל</Badge>;
      case 'degraded':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">מוגבל</Badge>;
      case 'outage':
        return <Badge className="bg-red-100 text-red-800 border-red-200">תקלה</Badge>;
      case 'maintenance':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">תחזוקה</Badge>;
      default:
        return <Badge variant="secondary">לא ידוע</Badge>;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <Badge variant="destructive">קריטי</Badge>;
      case 'high':
        return <Badge className="bg-red-100 text-red-800">גבוה</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800">בינוני</Badge>;
      case 'low':
        return <Badge className="bg-blue-100 text-blue-800">נמוך</Badge>;
      default:
        return <Badge variant="secondary">לא ידוע</Badge>;
    }
  };

  const getIncidentStatusBadge = (status: string) => {
    switch (status) {
      case 'investigating':
        return <Badge className="bg-orange-100 text-orange-800">בחקירה</Badge>;
      case 'identified':
        return <Badge className="bg-yellow-100 text-yellow-800">זוהה</Badge>;
      case 'monitoring':
        return <Badge className="bg-blue-100 text-blue-800">במעקב</Badge>;
      case 'resolved':
        return <Badge className="bg-green-100 text-green-800">נפתר</Badge>;
      default:
        return <Badge variant="secondary">לא ידוע</Badge>;
    }
  };

  const getMetricStatus = (metric: SystemMetric) => {
    if (metric.status === 'critical') return 'text-red-600';
    if (metric.status === 'warning') return 'text-yellow-600';
    return 'text-green-600';
  };

  const getMetricProgress = (metric: SystemMetric) => {
    if (metric.unit === '%') return metric.value;
    return (metric.value / metric.threshold) * 100;
  };

  const overallStatus = services.every(s => s.status === 'operational') ? 'operational' :
                       services.some(s => s.status === 'outage') ? 'outage' : 'degraded';

  const averageUptime = services.reduce((acc, service) => acc + service.uptime, 0) / services.length;
  const averageResponseTime = services.reduce((acc, service) => acc + service.responseTime, 0) / services.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
            <Activity className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              <AutoTranslateText 
                translationKey="superAdmin.serviceStatus" 
                fallback="Service Status"
              />
            </h1>
            <p className="text-muted-foreground">
              <AutoTranslateText 
                translationKey="superAdmin.serviceStatusDesc" 
                fallback="Monitor system health and service availability"
              />
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            עדכון אחרון: {lastUpdate.toLocaleTimeString('he-IL')}
          </Badge>
          <Button 
            variant="outline" 
            onClick={handleRefreshStatus}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            רענן
          </Button>
        </div>
      </div>

      {/* Overall Status */}
      <Card className={`border-2 ${
        overallStatus === 'operational' ? 'border-green-200 bg-green-50' :
        overallStatus === 'outage' ? 'border-red-200 bg-red-50' :
        'border-yellow-200 bg-yellow-50'
      }`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {getStatusIcon(overallStatus)}
              <div>
                <h2 className="text-2xl font-bold">
                  {overallStatus === 'operational' ? 'כל השירותים פעילים' :
                   overallStatus === 'outage' ? 'תקלה במערכת' :
                   'ביצועים מוגבלים'}
                </h2>
                <p className="text-muted-foreground">
                  זמינות ממוצעת: {averageUptime.toFixed(2)}% • זמן תגובה ממוצע: {averageResponseTime.toFixed(0)}ms
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-green-600">{averageUptime.toFixed(2)}%</div>
              <div className="text-sm text-muted-foreground">זמינות כללית</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mockSystemMetrics.map((metric, index) => {
          const IconComponent = metric.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <IconComponent className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">{metric.name}</span>
                  </div>
                  <span className={`text-2xl font-bold ${getMetricStatus(metric)}`}>
                    {metric.value}{metric.unit}
                  </span>
                </div>
                <div className="space-y-2">
                  <Progress 
                    value={getMetricProgress(metric)} 
                    className={`h-2 ${
                      metric.status === 'critical' ? '[&>div]:bg-red-500' :
                      metric.status === 'warning' ? '[&>div]:bg-yellow-500' :
                      '[&>div]:bg-green-500'
                    }`}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0</span>
                    <span>סף: {metric.threshold}{metric.unit}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Services Status */}
      <Tabs defaultValue="services" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="services" className="flex items-center gap-2">
            <Server className="h-4 w-4" />
            שירותים
          </TabsTrigger>
          <TabsTrigger value="incidents" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            תקריות
          </TabsTrigger>
        </TabsList>

        {/* Services Tab */}
        <TabsContent value="services">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((service) => {
              const IconComponent = service.icon;
              return (
                <Card key={service.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-muted rounded-lg">
                          <IconComponent className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{service.name}</h3>
                          <p className="text-sm text-muted-foreground">{service.description}</p>
                        </div>
                      </div>
                      {getStatusBadge(service.status)}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">זמינות</div>
                        <div className="font-medium text-green-600">{service.uptime}%</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">זמן תגובה</div>
                        <div className="font-medium">{service.responseTime}ms</div>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        בדיקה אחרונה: {service.lastChecked}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Incidents Tab */}
        <TabsContent value="incidents">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                תקריות אחרונות
              </CardTitle>
              <CardDescription>
                מעקב אחר תקריות ובעיות במערכת
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockIncidents.map((incident) => (
                  <div key={incident.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold">{incident.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{incident.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {getSeverityBadge(incident.severity)}
                        {getIncidentStatusBadge(incident.status)}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span>התחיל: {incident.startTime}</span>
                        </div>
                        {incident.resolvedTime && (
                          <div className="flex items-center gap-1">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            <span>נפתר: {incident.resolvedTime}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-muted-foreground">שירותים מושפעים:</span>
                        <div className="flex gap-1">
                          {incident.affectedServices.map((service, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {service}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}