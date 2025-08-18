'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { CreditCard, Users, TrendingUp, DollarSign, Search, Filter, Download, Plus, Edit, Trash2, Eye, Calendar, AlertCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { AutoTranslateText } from '@/components/translation/auto-translate-text';
import { useLanguage } from '@/context/language-context';

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: 'monthly' | 'yearly';
  features: string[];
  maxRestaurants: number;
  maxOrders: number;
  commissionRate: number;
  isActive: boolean;
  subscriberCount: number;
  createdAt: string;
}

interface Subscription {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  planId: string;
  planName: string;
  status: 'active' | 'inactive' | 'cancelled' | 'expired' | 'pending';
  startDate: string;
  endDate: string;
  nextBilling: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  autoRenew: boolean;
}

const mockPlans: SubscriptionPlan[] = [
  {
    id: '1',
    name: 'Basic',
    description: 'Perfect for small restaurants',
    price: 99,
    currency: 'ILS',
    interval: 'monthly',
    features: ['Up to 5 restaurants', 'Basic analytics', 'Email support'],
    maxRestaurants: 5,
    maxOrders: 1000,
    commissionRate: 15,
    isActive: true,
    subscriberCount: 45,
    createdAt: '2024-01-01'
  },
  {
    id: '2',
    name: 'Professional',
    description: 'For growing restaurant chains',
    price: 199,
    currency: 'ILS',
    interval: 'monthly',
    features: ['Up to 20 restaurants', 'Advanced analytics', 'Priority support', 'Custom branding'],
    maxRestaurants: 20,
    maxOrders: 5000,
    commissionRate: 12,
    isActive: true,
    subscriberCount: 28,
    createdAt: '2024-01-01'
  },
  {
    id: '3',
    name: 'Enterprise',
    description: 'For large restaurant networks',
    price: 399,
    currency: 'ILS',
    interval: 'monthly',
    features: ['Unlimited restaurants', 'Full analytics suite', '24/7 support', 'API access', 'White-label solution'],
    maxRestaurants: -1,
    maxOrders: -1,
    commissionRate: 10,
    isActive: true,
    subscriberCount: 12,
    createdAt: '2024-01-01'
  },
  {
    id: '4',
    name: 'Startup',
    description: 'For new restaurants (discontinued)',
    price: 49,
    currency: 'ILS',
    interval: 'monthly',
    features: ['Up to 2 restaurants', 'Basic features'],
    maxRestaurants: 2,
    maxOrders: 500,
    commissionRate: 18,
    isActive: false,
    subscriberCount: 8,
    createdAt: '2023-12-01'
  }
];

const mockSubscriptions: Subscription[] = [
  {
    id: '1',
    userId: 'u1',
    userName: 'מסעדת הבית',
    userEmail: 'info@habayit.co.il',
    planId: '2',
    planName: 'Professional',
    status: 'active',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    nextBilling: '2024-02-01',
    amount: 199,
    currency: 'ILS',
    paymentMethod: 'Credit Card',
    autoRenew: true
  },
  {
    id: '2',
    userId: 'u2',
    userName: 'פיצה פלוס',
    userEmail: 'contact@pizzaplus.co.il',
    planId: '1',
    planName: 'Basic',
    status: 'active',
    startDate: '2024-01-15',
    endDate: '2024-12-15',
    nextBilling: '2024-02-15',
    amount: 99,
    currency: 'ILS',
    paymentMethod: 'Bank Transfer',
    autoRenew: true
  },
  {
    id: '3',
    userId: 'u3',
    userName: 'רשת המבורגר',
    userEmail: 'admin@burgerchain.co.il',
    planId: '3',
    planName: 'Enterprise',
    status: 'active',
    startDate: '2023-12-01',
    endDate: '2024-11-30',
    nextBilling: '2024-02-01',
    amount: 399,
    currency: 'ILS',
    paymentMethod: 'Credit Card',
    autoRenew: true
  },
  {
    id: '4',
    userId: 'u4',
    userName: 'קפה ברחוב',
    userEmail: 'info@cafestreet.co.il',
    planId: '1',
    planName: 'Basic',
    status: 'expired',
    startDate: '2023-06-01',
    endDate: '2024-01-01',
    nextBilling: '-',
    amount: 99,
    currency: 'ILS',
    paymentMethod: 'Credit Card',
    autoRenew: false
  },
  {
    id: '5',
    userId: 'u5',
    userName: 'סושי טוקיו',
    userEmail: 'orders@sushitokyo.co.il',
    planId: '2',
    planName: 'Professional',
    status: 'cancelled',
    startDate: '2023-08-01',
    endDate: '2024-01-10',
    nextBilling: '-',
    amount: 199,
    currency: 'ILS',
    paymentMethod: 'Credit Card',
    autoRenew: false
  }
];

export default function SubscriptionManagementPage() {
  const { toast } = useToast();
  const { isRTL } = useLanguage();
  const [plans, setPlans] = useState<SubscriptionPlan[]>(mockPlans);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(mockSubscriptions);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isCreatePlanOpen, setIsCreatePlanOpen] = useState(false);
  const [newPlan, setNewPlan] = useState({
    name: '',
    description: '',
    price: 0,
    interval: 'monthly' as 'monthly' | 'yearly',
    features: [] as string[],
    maxRestaurants: 0,
    maxOrders: 0,
    commissionRate: 15
  });
  const [newFeature, setNewFeature] = useState('');

  const filteredSubscriptions = subscriptions.filter(sub => {
    const matchesSearch = sub.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sub.userEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlan = selectedPlan === 'all' || sub.planName === selectedPlan;
    const matchesStatus = selectedStatus === 'all' || sub.status === selectedStatus;
    return matchesSearch && matchesPlan && matchesStatus;
  });

  const totalRevenue = subscriptions
    .filter(sub => sub.status === 'active')
    .reduce((sum, sub) => sum + sub.amount, 0);

  const activeSubscriptions = subscriptions.filter(sub => sub.status === 'active').length;
  const totalSubscriptions = subscriptions.length;
  const churnRate = ((subscriptions.filter(sub => sub.status === 'cancelled').length / totalSubscriptions) * 100).toFixed(1);

  const handleCreatePlan = () => {
    if (!newPlan.name || !newPlan.description || newPlan.price <= 0) {
      toast({
        title: 'שגיאה',
        description: 'אנא מלא את כל השדות הנדרשים',
        variant: 'destructive'
      });
      return;
    }

    const plan: SubscriptionPlan = {
      id: Date.now().toString(),
      name: newPlan.name,
      description: newPlan.description,
      price: newPlan.price,
      currency: 'ILS',
      interval: newPlan.interval,
      features: newPlan.features,
      maxRestaurants: newPlan.maxRestaurants,
      maxOrders: newPlan.maxOrders,
      commissionRate: newPlan.commissionRate,
      isActive: true,
      subscriberCount: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setPlans([...plans, plan]);
    setNewPlan({
      name: '',
      description: '',
      price: 0,
      interval: 'monthly',
      features: [],
      maxRestaurants: 0,
      maxOrders: 0,
      commissionRate: 15
    });
    setIsCreatePlanOpen(false);
    
    toast({
      title: 'תוכנית נוצרה בהצלחה',
      description: `התוכנית "${plan.name}" נוצרה במערכת`,
    });
  };

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setNewPlan({
        ...newPlan,
        features: [...newPlan.features, newFeature.trim()]
      });
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (index: number) => {
    setNewPlan({
      ...newPlan,
      features: newPlan.features.filter((_, i) => i !== index)
    });
  };

  const handleTogglePlanStatus = (planId: string) => {
    setPlans(plans.map(plan => {
      if (plan.id === planId) {
        return { ...plan, isActive: !plan.isActive };
      }
      return plan;
    }));
    
    toast({
      title: 'סטטוס תוכנית עודכן',
      description: 'סטטוס התוכנית עודכן בהצלחה',
    });
  };

  const handleUpdateSubscriptionStatus = (subscriptionId: string, newStatus: string) => {
    setSubscriptions(subscriptions.map(sub => {
      if (sub.id === subscriptionId) {
        return { ...sub, status: newStatus as any };
      }
      return sub;
    }));
    
    toast({
      title: 'סטטוס מנוי עודכן',
      description: 'סטטוס המנוי עודכן בהצלחה',
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">פעיל</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">לא פעיל</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">מבוטל</Badge>;
      case 'expired':
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">פג תוקף</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">ממתין</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl">
            <CreditCard className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              <AutoTranslateText 
                translationKey="superAdmin.subscriptionManagement" 
                fallback="Subscription Management"
              />
            </h1>
            <p className="text-muted-foreground">
              <AutoTranslateText 
                translationKey="superAdmin.subscriptionManagementDesc" 
                fallback="Manage subscription plans and user subscriptions"
              />
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">הכנסות חודשיות</p>
                <p className="text-2xl font-bold">₪{totalRevenue.toLocaleString()}</p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">מנויים פעילים</p>
                <p className="text-2xl font-bold">{activeSubscriptions}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">סה"כ מנויים</p>
                <p className="text-2xl font-bold">{totalSubscriptions}</p>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">שיעור נטישה</p>
                <p className="text-2xl font-bold">{churnRate}%</p>
              </div>
              <div className="p-2 bg-orange-100 rounded-lg">
                <AlertCircle className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subscription Management Tabs */}
      <Tabs defaultValue="subscriptions" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="subscriptions" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            מנויים
          </TabsTrigger>
          <TabsTrigger value="plans" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            תוכניות מנוי
          </TabsTrigger>
        </TabsList>

        {/* Subscriptions Management */}
        <TabsContent value="subscriptions">
          <div className="space-y-6">
            {/* Filters and Search */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    מנויים פעילים
                  </span>
                  <div className="flex items-center gap-2">
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      ייצא נתונים
                    </Button>
                  </div>
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
                  <Select value={selectedPlan} onValueChange={setSelectedPlan}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="סנן לפי תוכנית" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">כל התוכניות</SelectItem>
                      {plans.map((plan) => (
                        <SelectItem key={plan.id} value={plan.name}>
                          {plan.name}
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
                      <SelectItem value="cancelled">מבוטל</SelectItem>
                      <SelectItem value="expired">פג תוקף</SelectItem>
                      <SelectItem value="pending">ממתין</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Subscriptions Table */}
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>לקוח</TableHead>
                      <TableHead>תוכנית</TableHead>
                      <TableHead>סטטוס</TableHead>
                      <TableHead>סכום</TableHead>
                      <TableHead>חיוב הבא</TableHead>
                      <TableHead>תאריך סיום</TableHead>
                      <TableHead>פעולות</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSubscriptions.map((subscription) => (
                      <TableRow key={subscription.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{subscription.userName}</div>
                            <div className="text-sm text-muted-foreground">{subscription.userEmail}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{subscription.planName}</Badge>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(subscription.status)}
                        </TableCell>
                        <TableCell className="font-medium">
                          ₪{subscription.amount}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {subscription.nextBilling}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {subscription.endDate}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Select
                              value={subscription.status}
                              onValueChange={(value) => handleUpdateSubscriptionStatus(subscription.id, value)}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="active">פעיל</SelectItem>
                                <SelectItem value="inactive">לא פעיל</SelectItem>
                                <SelectItem value="cancelled">מבוטל</SelectItem>
                                <SelectItem value="expired">פג תוקף</SelectItem>
                                <SelectItem value="pending">ממתין</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
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

        {/* Plans Management */}
        <TabsContent value="plans">
          <div className="space-y-6">
            {/* Plans Header */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    תוכניות מנוי
                  </span>
                  <Dialog open={isCreatePlanOpen} onOpenChange={setIsCreatePlanOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700">
                        <Plus className="h-4 w-4 mr-2" />
                        הוסף תוכנית
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>צור תוכנית מנוי חדשה</DialogTitle>
                        <DialogDescription>
                          הגדר תוכנית מנוי חדשה עם מחירים ותכונות
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 max-h-96 overflow-y-auto">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="planName">שם התוכנית</Label>
                            <Input
                              id="planName"
                              value={newPlan.name}
                              onChange={(e) => setNewPlan({...newPlan, name: e.target.value})}
                              placeholder="הכנס שם תוכנית"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="planPrice">מחיר (₪)</Label>
                            <Input
                              id="planPrice"
                              type="number"
                              value={newPlan.price}
                              onChange={(e) => setNewPlan({...newPlan, price: parseFloat(e.target.value)})}
                              placeholder="0"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="planDescription">תיאור התוכנית</Label>
                          <Textarea
                            id="planDescription"
                            value={newPlan.description}
                            onChange={(e) => setNewPlan({...newPlan, description: e.target.value})}
                            placeholder="הכנס תיאור התוכנית"
                          />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="maxRestaurants">מקס' מסעדות</Label>
                            <Input
                              id="maxRestaurants"
                              type="number"
                              value={newPlan.maxRestaurants}
                              onChange={(e) => setNewPlan({...newPlan, maxRestaurants: parseInt(e.target.value)})}
                              placeholder="0"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="maxOrders">מקס' הזמנות</Label>
                            <Input
                              id="maxOrders"
                              type="number"
                              value={newPlan.maxOrders}
                              onChange={(e) => setNewPlan({...newPlan, maxOrders: parseInt(e.target.value)})}
                              placeholder="0"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="commissionRate">שיעור עמלה (%)</Label>
                            <Input
                              id="commissionRate"
                              type="number"
                              step="0.1"
                              value={newPlan.commissionRate}
                              onChange={(e) => setNewPlan({...newPlan, commissionRate: parseFloat(e.target.value)})}
                              placeholder="15"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>תכונות</Label>
                          <div className="flex gap-2">
                            <Input
                              value={newFeature}
                              onChange={(e) => setNewFeature(e.target.value)}
                              placeholder="הוסף תכונה"
                              onKeyPress={(e) => e.key === 'Enter' && handleAddFeature()}
                            />
                            <Button type="button" onClick={handleAddFeature}>
                              הוסף
                            </Button>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {newPlan.features.map((feature, index) => (
                              <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => handleRemoveFeature(index)}>
                                {feature} ×
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCreatePlanOpen(false)}>
                          ביטול
                        </Button>
                        <Button onClick={handleCreatePlan}>
                          צור תוכנית
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardTitle>
              </CardHeader>
            </Card>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <Card key={plan.id} className={`relative ${!plan.isActive ? 'opacity-60' : ''}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{plan.name}</CardTitle>
                      <div className="flex items-center gap-1">
                        <Switch
                          checked={plan.isActive}
                          onCheckedChange={() => handleTogglePlanStatus(plan.id)}
                        />
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold">₪{plan.price}</div>
                        <div className="text-sm text-muted-foreground">/{plan.interval === 'monthly' ? 'חודש' : 'שנה'}</div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">מנויים:</span>
                          <div className="font-medium">{plan.subscriberCount}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">עמלה:</span>
                          <div className="font-medium">{plan.commissionRate}%</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">מסעדות:</span>
                          <div className="font-medium">{plan.maxRestaurants === -1 ? 'ללא הגבלה' : plan.maxRestaurants}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">הזמנות:</span>
                          <div className="font-medium">{plan.maxOrders === -1 ? 'ללא הגבלה' : plan.maxOrders.toLocaleString()}</div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <span className="text-sm font-medium">תכונות:</span>
                        <div className="space-y-1">
                          {plan.features.map((feature, index) => (
                            <div key={index} className="text-xs text-muted-foreground flex items-center gap-1">
                              <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                              {feature}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="text-xs text-muted-foreground">
                        נוצר: {plan.createdAt}
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