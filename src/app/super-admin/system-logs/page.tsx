'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { FileText, Search, Filter, Download, RefreshCw, AlertTriangle, Info, CheckCircle, XCircle, Clock, User, Server, Database, Shield } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AutoTranslateText } from '@/components/translation/auto-translate-text';
import { useLanguage } from '@/context/language-context';

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'success';
  category: 'system' | 'security' | 'database' | 'api' | 'user' | 'payment';
  message: string;
  details?: string;
  userId?: string;
  ip?: string;
  userAgent?: string;
}

interface SystemStats {
  totalLogs: number;
  errorCount: number;
  warningCount: number;
  infoCount: number;
  successCount: number;
  criticalIssues: number;
}

const mockSystemStats: SystemStats = {
  totalLogs: 15678,
  errorCount: 234,
  warningCount: 567,
  infoCount: 12890,
  successCount: 1987,
  criticalIssues: 12
};

const mockLogs: LogEntry[] = [
  {
    id: '1',
    timestamp: '2024-01-15 14:30:25',
    level: 'error',
    category: 'database',
    message: 'Database connection timeout',
    details: 'Connection to primary database failed after 30 seconds',
    ip: '192.168.1.100'
  },
  {
    id: '2',
    timestamp: '2024-01-15 14:28:15',
    level: 'warning',
    category: 'security',
    message: 'Multiple failed login attempts',
    details: '5 failed login attempts from IP 203.0.113.45',
    userId: 'user_12345',
    ip: '203.0.113.45',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
  },
  {
    id: '3',
    timestamp: '2024-01-15 14:25:10',
    level: 'info',
    category: 'user',
    message: 'User registration completed',
    details: 'New user registered successfully',
    userId: 'user_67890',
    ip: '198.51.100.25'
  },
  {
    id: '4',
    timestamp: '2024-01-15 14:22:45',
    level: 'success',
    category: 'payment',
    message: 'Payment processed successfully',
    details: 'Order #ORD-2024-001 payment completed',
    userId: 'user_54321',
    ip: '203.0.113.78'
  },
  {
    id: '5',
    timestamp: '2024-01-15 14:20:30',
    level: 'error',
    category: 'api',
    message: 'API rate limit exceeded',
    details: 'Client exceeded 1000 requests per hour limit',
    ip: '198.51.100.100'
  },
  {
    id: '6',
    timestamp: '2024-01-15 14:18:20',
    level: 'warning',
    category: 'system',
    message: 'High CPU usage detected',
    details: 'CPU usage reached 85% for 5 minutes',
    ip: 'localhost'
  },
  {
    id: '7',
    timestamp: '2024-01-15 14:15:55',
    level: 'info',
    category: 'system',
    message: 'Scheduled backup completed',
    details: 'Daily database backup completed successfully',
    ip: 'localhost'
  },
  {
    id: '8',
    timestamp: '2024-01-15 14:12:40',
    level: 'error',
    category: 'security',
    message: 'Suspicious activity detected',
    details: 'Potential SQL injection attempt blocked',
    ip: '203.0.113.200',
    userAgent: 'curl/7.68.0'
  },
  {
    id: '9',
    timestamp: '2024-01-15 14:10:15',
    level: 'success',
    category: 'user',
    message: 'Password reset completed',
    details: 'User successfully reset password',
    userId: 'user_98765',
    ip: '198.51.100.50'
  },
  {
    id: '10',
    timestamp: '2024-01-15 14:08:30',
    level: 'info',
    category: 'api',
    message: 'API endpoint accessed',
    details: 'GET /api/restaurants endpoint called',
    ip: '203.0.113.150'
  }
];

export default function SystemLogsPage() {
  const { toast } = useToast();
  const { isRTL } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTimeRange, setSelectedTimeRange] = useState('today');
  const [logs, setLogs] = useState(mockLogs);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshLogs = async () => {
    setIsRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setIsRefreshing(false);
      toast({
        title: 'רענון לוגים',
        description: 'הלוגים עודכנו בהצלחה',
      });
    }, 2000);
  };

  const handleExportLogs = () => {
    toast({
      title: 'ייצוא לוגים',
      description: 'הלוגים יוצאו בהצלחה לקובץ CSV',
    });
  };

  const handleClearLogs = () => {
    toast({
      title: 'ניקוי לוגים',
      description: 'לוגים ישנים נוקו בהצלחה',
    });
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'info':
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getLevelBadgeVariant = (level: string) => {
    switch (level) {
      case 'error':
        return 'destructive';
      case 'warning':
        return 'secondary';
      case 'success':
        return 'default';
      case 'info':
      default:
        return 'outline';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'security':
        return <Shield className="h-4 w-4" />;
      case 'database':
        return <Database className="h-4 w-4" />;
      case 'system':
        return <Server className="h-4 w-4" />;
      case 'user':
        return <User className="h-4 w-4" />;
      case 'api':
      case 'payment':
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.details?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.ip?.includes(searchTerm);
    const matchesLevel = selectedLevel === 'all' || log.level === selectedLevel;
    const matchesCategory = selectedCategory === 'all' || log.category === selectedCategory;
    return matchesSearch && matchesLevel && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-slate-500 to-gray-500 rounded-xl">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              <AutoTranslateText 
                translationKey="superAdmin.systemLogs" 
                fallback="System Logs"
              />
            </h1>
            <p className="text-muted-foreground">
              <AutoTranslateText 
                translationKey="superAdmin.systemLogsDesc" 
                fallback="Monitor and analyze system activity logs"
              />
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={handleRefreshLogs}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            רענן
          </Button>
          <Button variant="outline" onClick={handleExportLogs}>
            <Download className="h-4 w-4 mr-2" />
            ייצא
          </Button>
          <Button variant="outline" onClick={handleClearLogs}>
            נקה לוגים ישנים
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">סה"כ לוגים</p>
                <p className="text-2xl font-bold">{mockSystemStats.totalLogs.toLocaleString()}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">שגיאות</p>
                <p className="text-2xl font-bold text-red-600">{mockSystemStats.errorCount}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">אזהרות</p>
                <p className="text-2xl font-bold text-yellow-600">{mockSystemStats.warningCount}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">מידע</p>
                <p className="text-2xl font-bold text-blue-600">{mockSystemStats.infoCount}</p>
              </div>
              <Info className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">הצלחות</p>
                <p className="text-2xl font-bold text-green-600">{mockSystemStats.successCount}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">קריטיות</p>
                <p className="text-2xl font-bold text-red-600">{mockSystemStats.criticalIssues}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="חפש בלוגים..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="רמת חומרה" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">כל הרמות</SelectItem>
                <SelectItem value="error">שגיאות</SelectItem>
                <SelectItem value="warning">אזהרות</SelectItem>
                <SelectItem value="info">מידע</SelectItem>
                <SelectItem value="success">הצלחות</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="קטגוריה" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">כל הקטגוריות</SelectItem>
                <SelectItem value="system">מערכת</SelectItem>
                <SelectItem value="security">אבטחה</SelectItem>
                <SelectItem value="database">מסד נתונים</SelectItem>
                <SelectItem value="api">API</SelectItem>
                <SelectItem value="user">משתמש</SelectItem>
                <SelectItem value="payment">תשלומים</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="טווח זמן" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">היום</SelectItem>
                <SelectItem value="week">השבוע</SelectItem>
                <SelectItem value="month">החודש</SelectItem>
                <SelectItem value="year">השנה</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              לוגי מערכת ({filteredLogs.length})
            </span>
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                <Clock className="h-3 w-3 mr-1" />
                עדכון אחרון: {new Date().toLocaleTimeString('he-IL')}
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>זמן</TableHead>
                  <TableHead>רמה</TableHead>
                  <TableHead>קטגוריה</TableHead>
                  <TableHead>הודעה</TableHead>
                  <TableHead>פרטים</TableHead>
                  <TableHead>IP</TableHead>
                  <TableHead>משתמש</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log.id} className="hover:bg-muted/50">
                    <TableCell className="font-mono text-sm">
                      {log.timestamp}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getLevelBadgeVariant(log.level)} className="flex items-center gap-1 w-fit">
                        {getLevelIcon(log.level)}
                        {log.level}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(log.category)}
                        <span className="capitalize">{log.category}</span>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="truncate" title={log.message}>
                        {log.message}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      {log.details && (
                        <div className="truncate text-muted-foreground" title={log.details}>
                          {log.details}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {log.ip}
                    </TableCell>
                    <TableCell>
                      {log.userId ? (
                        <Badge variant="outline">{log.userId}</Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {filteredLogs.length === 0 && (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">לא נמצאו לוגים התואמים לקריטריונים</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Critical Issues */}
      {mockSystemStats.criticalIssues > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-5 w-5" />
              בעיות קריטיות אחרונות
            </CardTitle>
            <CardDescription className="text-red-600">
              {mockSystemStats.criticalIssues} בעיות קריטיות זוהו ב-24 השעות האחרונות
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredLogs.filter(log => log.level === 'error').slice(0, 3).map((log) => (
                <div key={log.id} className="flex items-start gap-3 p-3 bg-white rounded-lg border border-red-200">
                  <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                  <div className="flex-1">
                    <div className="font-medium text-red-900">{log.message}</div>
                    <div className="text-sm text-red-700 mt-1">{log.details}</div>
                    <div className="text-xs text-red-600 mt-2">
                      {log.timestamp} • {log.ip}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}