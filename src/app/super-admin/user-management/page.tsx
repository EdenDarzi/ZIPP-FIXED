'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Users, Search, UserPlus, Edit2, Trash2, Shield, Ban, CheckCircle, AlertCircle, Eye, Mail, Phone, MapPin, Calendar, Filter } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AutoTranslateText } from '@/components/translation/auto-translate-text';
import { useLanguage } from '@/context/language-context';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: 'customer' | 'business' | 'courier';
  status: 'active' | 'suspended' | 'banned';
  registrationDate: string;
  lastLogin: string;
  totalOrders: number;
  location: string;
  verified: boolean;
}

const mockUsers: User[] = [
  {
    id: 'usr_001',
    name: 'יוסי כהן',
    email: 'yossi@example.com',
    phone: '+972-50-1234567',
    type: 'customer',
    status: 'active',
    registrationDate: '2024-01-15',
    lastLogin: '2024-12-20',
    totalOrders: 45,
    location: 'תל אביב',
    verified: true
  },
  {
    id: 'bus_002',
    name: 'מסעדת הכוכב',
    email: 'star@restaurant.com',
    phone: '+972-03-9876543',
    type: 'business',
    status: 'active',
    registrationDate: '2024-02-10',
    lastLogin: '2024-12-20',
    totalOrders: 234,
    location: 'חיפה',
    verified: true
  },
  {
    id: 'cur_003',
    name: 'דני שליח',
    email: 'danny@courier.com',
    phone: '+972-52-5555555',
    type: 'courier',
    status: 'suspended',
    registrationDate: '2024-03-05',
    lastLogin: '2024-12-18',
    totalOrders: 156,
    location: 'ירושלים',
    verified: false
  },
  {
    id: 'usr_004',
    name: 'שרה לוי',
    email: 'sarah@example.com',
    phone: '+972-54-7777777',
    type: 'customer',
    status: 'banned',
    registrationDate: '2024-01-20',
    lastLogin: '2024-12-15',
    totalOrders: 12,
    location: 'באר שבע',
    verified: true
  }
];

export default function UserManagementPage() {
  const { toast } = useToast();
  const { isRTL } = useLanguage();
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || user.type === filterType;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleStatusChange = (userId: string, newStatus: 'active' | 'suspended' | 'banned') => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, status: newStatus } : user
    ));
    toast({
      title: 'סטטוס משתמש עודכן',
      description: `סטטוס המשתמש שונה ל-${newStatus}`,
    });
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(prev => prev.filter(user => user.id !== userId));
    toast({
      title: 'משתמש נמחק',
      description: 'המשתמש הוסר מהמערכת בהצלחה',
      variant: 'destructive'
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'suspended': return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'banned': return <Ban className="h-4 w-4 text-red-500" />;
      default: return null;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'customer': return <Users className="h-4 w-4 text-blue-500" />;
      case 'business': return <Shield className="h-4 w-4 text-purple-500" />;
      case 'courier': return <MapPin className="h-4 w-4 text-orange-500" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
            <Users className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              <AutoTranslateText 
                translationKey="superAdmin.userManagement" 
                fallback="User Management"
              />
            </h1>
            <p className="text-muted-foreground">
              <AutoTranslateText 
                translationKey="superAdmin.userManagementDesc" 
                fallback="Manage all platform users, businesses, and couriers"
              />
            </p>
          </div>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
          <UserPlus className="h-4 w-4 mr-2" />
          <AutoTranslateText 
            translationKey="superAdmin.addNewUser" 
            fallback="Add New User"
          />
        </Button>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            <AutoTranslateText 
              translationKey="superAdmin.filtersAndSearch" 
              fallback="Filters & Search"
            />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="search">
                <AutoTranslateText 
                  translationKey="superAdmin.searchUsers" 
                  fallback="Search Users"
                />
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="שם, אימייל או ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="type-filter">
                <AutoTranslateText 
                  translationKey="superAdmin.filterByType" 
                  fallback="Filter by Type"
                />
              </Label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">כל הסוגים</SelectItem>
                  <SelectItem value="customer">לקוחות</SelectItem>
                  <SelectItem value="business">עסקים</SelectItem>
                  <SelectItem value="courier">שליחים</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="status-filter">
                <AutoTranslateText 
                  translationKey="superAdmin.filterByStatus" 
                  fallback="Filter by Status"
                />
              </Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">כל הסטטוסים</SelectItem>
                  <SelectItem value="active">פעיל</SelectItem>
                  <SelectItem value="suspended">מושהה</SelectItem>
                  <SelectItem value="banned">חסום</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button variant="outline" className="w-full">
                <AutoTranslateText 
                  translationKey="superAdmin.exportData" 
                  fallback="Export Data"
                />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            <AutoTranslateText 
              translationKey="superAdmin.usersTable" 
              fallback="Users Table"
            />
          </CardTitle>
          <CardDescription>
            מציג {filteredUsers.length} משתמשים מתוך {users.length} סה"כ
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>שם</TableHead>
                <TableHead>סוג</TableHead>
                <TableHead>סטטוס</TableHead>
                <TableHead>אימייל</TableHead>
                <TableHead>טלפון</TableHead>
                <TableHead>הזמנות</TableHead>
                <TableHead>מיקום</TableHead>
                <TableHead>פעולות</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-mono text-xs">{user.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="font-medium">{user.name}</div>
                      {user.verified && <CheckCircle className="h-4 w-4 text-green-500" />}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getTypeIcon(user.type)}
                      <Badge variant="outline">
                        {user.type === 'customer' ? 'לקוח' : 
                         user.type === 'business' ? 'עסק' : 'שליח'}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(user.status)}
                      <Badge 
                        variant={user.status === 'active' ? 'default' : 
                                user.status === 'suspended' ? 'secondary' : 'destructive'}
                      >
                        {user.status === 'active' ? 'פעיל' : 
                         user.status === 'suspended' ? 'מושהה' : 'חסום'}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs">{user.email}</TableCell>
                  <TableCell className="text-xs">{user.phone}</TableCell>
                  <TableCell className="text-center">{user.totalOrders}</TableCell>
                  <TableCell>{user.location}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Select onValueChange={(value) => handleStatusChange(user.id, value as any)}>
                        <SelectTrigger className="w-24 h-8">
                          <SelectValue placeholder="סטטוס" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">פעיל</SelectItem>
                          <SelectItem value="suspended">השהה</SelectItem>
                          <SelectItem value="banned">חסום</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              סה"כ משתמשים
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <div className="text-xs text-muted-foreground">+12% מהחודש הקודם</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              משתמשים פעילים
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {users.filter(u => u.status === 'active').length}
            </div>
            <div className="text-xs text-muted-foreground">85% מכלל המשתמשים</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              עסקים רשומים
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {users.filter(u => u.type === 'business').length}
            </div>
            <div className="text-xs text-muted-foreground">+3 השבוע</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              שליחים פעילים
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {users.filter(u => u.type === 'courier' && u.status === 'active').length}
            </div>
            <div className="text-xs text-muted-foreground">זמינים כעת</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}