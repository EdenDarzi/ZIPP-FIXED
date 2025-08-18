'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Shield, Users, Key, Lock, Plus, Search, Edit, Trash2, Eye, EyeOff, UserCheck, UserX, AlertTriangle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { AutoTranslateText } from '@/components/translation/auto-translate-text';
import { useLanguage } from '@/context/language-context';

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
  createdAt: string;
}

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'suspended';
  lastLogin: string;
  createdAt: string;
}

const mockRoles: Role[] = [
  {
    id: '1',
    name: 'Super Admin',
    description: 'Full system access',
    permissions: ['all'],
    userCount: 2,
    createdAt: '2024-01-01'
  },
  {
    id: '2',
    name: 'Platform Manager',
    description: 'Platform management and analytics',
    permissions: ['users.read', 'users.write', 'analytics.read', 'settings.read'],
    userCount: 5,
    createdAt: '2024-01-15'
  },
  {
    id: '3',
    name: 'Support Manager',
    description: 'Customer support and basic user management',
    permissions: ['users.read', 'support.read', 'support.write'],
    userCount: 8,
    createdAt: '2024-02-01'
  },
  {
    id: '4',
    name: 'Content Manager',
    description: 'Content and restaurant management',
    permissions: ['restaurants.read', 'restaurants.write', 'content.read', 'content.write'],
    userCount: 3,
    createdAt: '2024-02-15'
  }
];

const mockPermissions: Permission[] = [
  { id: 'users.read', name: 'View Users', description: 'View user information', category: 'Users' },
  { id: 'users.write', name: 'Manage Users', description: 'Create, edit, delete users', category: 'Users' },
  { id: 'restaurants.read', name: 'View Restaurants', description: 'View restaurant information', category: 'Restaurants' },
  { id: 'restaurants.write', name: 'Manage Restaurants', description: 'Create, edit, delete restaurants', category: 'Restaurants' },
  { id: 'orders.read', name: 'View Orders', description: 'View order information', category: 'Orders' },
  { id: 'orders.write', name: 'Manage Orders', description: 'Modify order status', category: 'Orders' },
  { id: 'analytics.read', name: 'View Analytics', description: 'Access analytics and reports', category: 'Analytics' },
  { id: 'settings.read', name: 'View Settings', description: 'View system settings', category: 'Settings' },
  { id: 'settings.write', name: 'Manage Settings', description: 'Modify system settings', category: 'Settings' },
  { id: 'support.read', name: 'View Support', description: 'View support tickets', category: 'Support' },
  { id: 'support.write', name: 'Manage Support', description: 'Handle support tickets', category: 'Support' },
  { id: 'content.read', name: 'View Content', description: 'View platform content', category: 'Content' },
  { id: 'content.write', name: 'Manage Content', description: 'Create and edit content', category: 'Content' }
];

const mockAdminUsers: AdminUser[] = [
  {
    id: '1',
    name: 'יוסי כהן',
    email: 'yossi@zipp.co.il',
    role: 'Super Admin',
    status: 'active',
    lastLogin: '2024-01-20 14:30',
    createdAt: '2024-01-01'
  },
  {
    id: '2',
    name: 'שרה לוי',
    email: 'sarah@zipp.co.il',
    role: 'Platform Manager',
    status: 'active',
    lastLogin: '2024-01-20 09:15',
    createdAt: '2024-01-10'
  },
  {
    id: '3',
    name: 'דוד מזרחי',
    email: 'david@zipp.co.il',
    role: 'Support Manager',
    status: 'inactive',
    lastLogin: '2024-01-18 16:45',
    createdAt: '2024-01-15'
  },
  {
    id: '4',
    name: 'רחל אברהם',
    email: 'rachel@zipp.co.il',
    role: 'Content Manager',
    status: 'active',
    lastLogin: '2024-01-19 11:20',
    createdAt: '2024-02-01'
  },
  {
    id: '5',
    name: 'מיכאל גולדברג',
    email: 'michael@zipp.co.il',
    role: 'Support Manager',
    status: 'suspended',
    lastLogin: '2024-01-15 13:10',
    createdAt: '2024-01-20'
  }
];

export default function AccessManagementPage() {
  const { toast } = useToast();
  const { isRTL } = useLanguage();
  const [roles, setRoles] = useState<Role[]>(mockRoles);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(mockAdminUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isCreateRoleOpen, setIsCreateRoleOpen] = useState(false);
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false);
  const [newRole, setNewRole] = useState({ name: '', description: '', permissions: [] as string[] });
  const [newUser, setNewUser] = useState({ name: '', email: '', role: '' });

  const filteredUsers = adminUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleCreateRole = () => {
    if (!newRole.name || !newRole.description) {
      toast({
        title: 'שגיאה',
        description: 'אנא מלא את כל השדות הנדרשים',
        variant: 'destructive'
      });
      return;
    }

    const role: Role = {
      id: Date.now().toString(),
      name: newRole.name,
      description: newRole.description,
      permissions: newRole.permissions,
      userCount: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setRoles([...roles, role]);
    setNewRole({ name: '', description: '', permissions: [] });
    setIsCreateRoleOpen(false);
    
    toast({
      title: 'תפקיד נוצר בהצלחה',
      description: `התפקיד "${role.name}" נוצר במערכת`,
    });
  };

  const handleCreateUser = () => {
    if (!newUser.name || !newUser.email || !newUser.role) {
      toast({
        title: 'שגיאה',
        description: 'אנא מלא את כל השדות הנדרשים',
        variant: 'destructive'
      });
      return;
    }

    const user: AdminUser = {
      id: Date.now().toString(),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      status: 'active',
      lastLogin: 'Never',
      createdAt: new Date().toISOString().split('T')[0]
    };

    setAdminUsers([...adminUsers, user]);
    setNewUser({ name: '', email: '', role: '' });
    setIsCreateUserOpen(false);
    
    toast({
      title: 'משתמש נוצר בהצלחה',
      description: `המשתמש "${user.name}" נוצר במערכת`,
    });
  };

  const handleDeleteRole = (roleId: string) => {
    const role = roles.find(r => r.id === roleId);
    if (role && role.userCount > 0) {
      toast({
        title: 'לא ניתן למחוק',
        description: 'לא ניתן למחוק תפקיד שיש לו משתמשים פעילים',
        variant: 'destructive'
      });
      return;
    }

    setRoles(roles.filter(r => r.id !== roleId));
    toast({
      title: 'תפקיד נמחק',
      description: 'התפקיד נמחק בהצלחה מהמערכת',
    });
  };

  const handleToggleUserStatus = (userId: string) => {
    setAdminUsers(adminUsers.map(user => {
      if (user.id === userId) {
        const newStatus = user.status === 'active' ? 'inactive' : 'active';
        return { ...user, status: newStatus };
      }
      return user;
    }));
    
    toast({
      title: 'סטטוס עודכן',
      description: 'סטטוס המשתמש עודכן בהצלחה',
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">פעיל</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">לא פעיל</Badge>;
      case 'suspended':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">מושעה</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              <AutoTranslateText 
                translationKey="superAdmin.accessManagement" 
                fallback="Access Management"
              />
            </h1>
            <p className="text-muted-foreground">
              <AutoTranslateText 
                translationKey="superAdmin.accessManagementDesc" 
                fallback="Manage user roles, permissions and access control"
              />
            </p>
          </div>
        </div>
      </div>

      {/* Access Management Tabs */}
      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            משתמשי מערכת
          </TabsTrigger>
          <TabsTrigger value="roles" className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            תפקידים והרשאות
          </TabsTrigger>
        </TabsList>

        {/* Admin Users Management */}
        <TabsContent value="users">
          <div className="space-y-6">
            {/* Filters and Search */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    משתמשי מערכת
                  </span>
                  <Dialog open={isCreateUserOpen} onOpenChange={setIsCreateUserOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                        <Plus className="h-4 w-4 mr-2" />
                        הוסף משתמש
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>הוסף משתמש מערכת חדש</DialogTitle>
                        <DialogDescription>
                          צור משתמש מערכת חדש עם הרשאות מתאימות
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="userName">שם מלא</Label>
                          <Input
                            id="userName"
                            value={newUser.name}
                            onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                            placeholder="הכנס שם מלא"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="userEmail">כתובת אימייל</Label>
                          <Input
                            id="userEmail"
                            type="email"
                            value={newUser.email}
                            onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                            placeholder="הכנס כתובת אימייל"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="userRole">תפקיד</Label>
                          <Select value={newUser.role} onValueChange={(value) => setNewUser({...newUser, role: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder="בחר תפקיד" />
                            </SelectTrigger>
                            <SelectContent>
                              {roles.map((role) => (
                                <SelectItem key={role.id} value={role.name}>
                                  {role.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCreateUserOpen(false)}>
                          ביטול
                        </Button>
                        <Button onClick={handleCreateUser}>
                          צור משתמש
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        placeholder="חפש לפי שם או אימייל..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={selectedRole} onValueChange={setSelectedRole}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="סנן לפי תפקיד" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">כל התפקידים</SelectItem>
                      {roles.map((role) => (
                        <SelectItem key={role.id} value={role.name}>
                          {role.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="סנן לפי סטטוס" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">כל הסטטוסים</SelectItem>
                      <SelectItem value="active">פעיל</SelectItem>
                      <SelectItem value="inactive">לא פעיל</SelectItem>
                      <SelectItem value="suspended">מושעה</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Users Table */}
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>משתמש</TableHead>
                      <TableHead>תפקיד</TableHead>
                      <TableHead>סטטוס</TableHead>
                      <TableHead>התחברות אחרונה</TableHead>
                      <TableHead>תאריך יצירה</TableHead>
                      <TableHead>פעולות</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{user.role}</Badge>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(user.status)}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {user.lastLogin}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {user.createdAt}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleToggleUserStatus(user.id)}
                            >
                              {user.status === 'active' ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
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
          </div>
        </TabsContent>

        {/* Roles and Permissions Management */}
        <TabsContent value="roles">
          <div className="space-y-6">
            {/* Roles Header */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Key className="h-5 w-5" />
                    תפקידים והרשאות
                  </span>
                  <Dialog open={isCreateRoleOpen} onOpenChange={setIsCreateRoleOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700">
                        <Plus className="h-4 w-4 mr-2" />
                        הוסף תפקיד
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>צור תפקיד חדש</DialogTitle>
                        <DialogDescription>
                          הגדר תפקיד חדש עם הרשאות מתאימות
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="roleName">שם התפקיד</Label>
                          <Input
                            id="roleName"
                            value={newRole.name}
                            onChange={(e) => setNewRole({...newRole, name: e.target.value})}
                            placeholder="הכנס שם תפקיד"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="roleDescription">תיאור התפקיד</Label>
                          <Input
                            id="roleDescription"
                            value={newRole.description}
                            onChange={(e) => setNewRole({...newRole, description: e.target.value})}
                            placeholder="הכנס תיאור התפקיד"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>הרשאות</Label>
                          <div className="grid grid-cols-2 gap-4 max-h-60 overflow-y-auto">
                            {mockPermissions.map((permission) => (
                              <div key={permission.id} className="flex items-center space-x-2">
                                <Checkbox
                                  id={permission.id}
                                  checked={newRole.permissions.includes(permission.id)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setNewRole({
                                        ...newRole,
                                        permissions: [...newRole.permissions, permission.id]
                                      });
                                    } else {
                                      setNewRole({
                                        ...newRole,
                                        permissions: newRole.permissions.filter(p => p !== permission.id)
                                      });
                                    }
                                  }}
                                />
                                <div className="grid gap-1.5 leading-none">
                                  <label
                                    htmlFor={permission.id}
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                  >
                                    {permission.name}
                                  </label>
                                  <p className="text-xs text-muted-foreground">
                                    {permission.description}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCreateRoleOpen(false)}>
                          ביטול
                        </Button>
                        <Button onClick={handleCreateRole}>
                          צור תפקיד
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardTitle>
              </CardHeader>
            </Card>

            {/* Roles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {roles.map((role) => (
                <Card key={role.id} className="relative">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{role.name}</CardTitle>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDeleteRole(role.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <CardDescription>{role.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">משתמשים פעילים:</span>
                        <Badge variant="secondary">{role.userCount}</Badge>
                      </div>
                      <div className="space-y-2">
                        <span className="text-sm font-medium">הרשאות:</span>
                        <div className="flex flex-wrap gap-1">
                          {role.permissions.includes('all') ? (
                            <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                              כל ההרשאות
                            </Badge>
                          ) : (
                            role.permissions.slice(0, 3).map((permission) => {
                              const perm = mockPermissions.find(p => p.id === permission);
                              return perm ? (
                                <Badge key={permission} variant="outline" className="text-xs">
                                  {perm.name}
                                </Badge>
                              ) : null;
                            })
                          )}
                          {role.permissions.length > 3 && !role.permissions.includes('all') && (
                            <Badge variant="outline" className="text-xs">
                              +{role.permissions.length - 3} נוספות
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        נוצר: {role.createdAt}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}