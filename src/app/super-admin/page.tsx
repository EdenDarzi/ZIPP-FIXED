
'use client'; // Marking as client component to use hooks like useToast

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ShieldCheck, Users, BarChart3, Settings, ChefHat, Truck, Home, AlertCircle, CheckCircle, KeyRound, UserCog, VenetianMask, Server, Settings2, Activity, Link as LinkIcon, Eye, Trash2, Loader2, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { AutoTranslateText } from '@/components/translation/auto-translate-text';
import { useLanguage } from '@/context/language-context';

interface IpRestriction {
    id: string;
    type: string;
    ip: string;
    status: string;
}

interface Subscription {
    id: string;
    name: string;
    type: string;
    plan: string;
    status: string;
    renewal: string;
}

const initialMockIpRestrictions: IpRestriction[] = [
    { id: 'user123', type: 'Business', ip: '192.168.1.100', status: 'Active' },
    { id: 'courier789', type: 'Courier', ip: '203.0.113.45', status: 'Active' },
];

const initialMockSubscriptions: Subscription[] = [
    { id: 'restaurant456', name: 'Star Restaurant', type: 'Business', plan: 'Pro Business', status: 'Active', renewal: '2024-08-15' },
    { id: 'courier007', name: 'Yossi Courier', type: 'Courier', plan: 'Premium Courier', status: 'Expired', renewal: '2024-07-01' },
    { id: 'business789', name: 'Flower Shop', type: 'Business', plan: 'Basic Business', status: 'Suspended', renewal: '2024-09-01' },
];


export default function SuperAdminDashboardPage() {
  const { toast } = useToast();
  const { isRTL } = useLanguage();
  const [ipUserId, setIpUserId] = useState('');
  const [ipAddress, setIpAddress] = useState('');
  const [subUserId, setSubUserId] = useState('');
  const [subPlan, setSubPlan] = useState('');
  const [subStatus, setSubStatus] = useState('');

  const [isLoadingData, setIsLoadingData] = useState(true);
  const [ipRestrictions, setIpRestrictions] = useState<IpRestriction[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);

  useEffect(() => {
    setIsLoadingData(true);
    // Simulate fetching data
    const timer = setTimeout(() => {
      setIpRestrictions(initialMockIpRestrictions);
      setSubscriptions(initialMockSubscriptions);
      setIsLoadingData(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);


  const handlePlaceholderClick = (featureName: string) => {
    toast({
      title: "Coming Soon!",
      description: `The '${featureName}' feature is still in development and will be available in upcoming updates.`,
    });
  };

  const quickLinks = [
    { href: '/restaurant-admin', labelKey: 'superAdmin.businessPortal', labelFallback: 'Business Management Portal', icon: ChefHat, descriptionKey: 'superAdmin.businessPortalDesc', descriptionFallback: "Manage businesses, menus and orders." },
    { href: '/courier/dashboard', labelKey: 'superAdmin.courierPortal', labelFallback: 'Courier Portal', icon: Truck, descriptionKey: 'superAdmin.courierPortalDesc', descriptionFallback: "Track couriers, bids and performance." },
    { href: '/', labelKey: 'superAdmin.customerView', labelFallback: 'Customer View', icon: Home, descriptionKey: 'superAdmin.customerViewDesc', descriptionFallback: "Experience the app as a customer." },
  ];

  const adminTools = [
    { labelKey: 'superAdmin.globalUserManagement', labelFallback: 'Global User Management', icon: Users, action: () => handlePlaceholderClick('User Management') },
    { labelKey: 'superAdmin.comprehensivePlatformAnalytics', labelFallback: 'Comprehensive Platform Analytics', icon: BarChart3, action: () => handlePlaceholderClick('Platform Analytics') },
    { labelKey: 'superAdmin.systemLogsAudit', labelFallback: 'System Logs & Audit', icon: Server, action: () => handlePlaceholderClick('System Logs') },
  ];

  const handleAddIpRestriction = () => {
    if (!ipUserId || !ipAddress) {
        toast({ title: "Missing Fields", description: "Please fill user ID and IP address.", variant: "destructive" });
        return;
    }
    const newRestriction: IpRestriction = { id: ipUserId, type: 'Unknown', ip: ipAddress, status: 'Active' }; // Type can be fetched or determined
    setIpRestrictions(prev => [newRestriction, ...prev]);
    toast({ title: "IP Restriction Updated (Demo)", description: `IP restriction for user ${ipUserId} to address ${ipAddress} has been updated in the system.` });
    setIpUserId('');
    setIpAddress('');
  };

  const handleUpdateSubscription = () => {
     if (!subUserId || !subPlan || !subStatus) {
        toast({ title: "Missing Fields", description: "Please fill user ID, plan and status.", variant: "destructive" });
        return;
    }
    const updatedSub: Subscription = { id: subUserId, name: 'Updated User', type: 'Unknown', plan: subPlan, status: subStatus, renewal: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US')};
    
    setSubscriptions(prev => {
      const existingIndex = prev.findIndex(s => s.id === subUserId);
      if (existingIndex >= 0) {
        const newArray = [...prev];
        newArray[existingIndex] = updatedSub;
        return newArray;
      } else {
        return [...prev, updatedSub];
      }
    });

    toast({ title: "Subscription Updated (Demo)", description: `Subscription for user ${subUserId} updated to plan ${subPlan} with status ${subStatus}.` });
    setSubUserId('');
    setSubPlan('');
    setSubStatus('');
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 p-8 shadow-2xl">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
              <ShieldCheck className="h-10 w-10 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white font-headline">
                <AutoTranslateText 
                  translationKey="superAdmin.dashboardTitle" 
                  fallback="Dashboard - Super Admin"
                />
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-purple-100 text-sm">System Status: All Operational</span>
              </div>
            </div>
          </div>
          <p className="text-purple-100 text-lg max-w-2xl leading-relaxed">
            <AutoTranslateText 
              translationKey="superAdmin.dashboardDescription" 
              fallback="Central management of SwiftServe platform. From here you can access all parts of the system, manage users, settings and get global insights."
            />
          </p>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
      </div>

      {/* Quick Portal Links */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
            <LinkIcon className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">
            <AutoTranslateText 
              translationKey="superAdmin.quickPortalLinks" 
              fallback="Quick Portal Links"
            />
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {quickLinks.map(link => (
            <div key={link.href} className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
              <Card className="relative bg-card/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-300 group-hover:scale-[1.02] rounded-2xl overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl group-hover:from-blue-200 group-hover:to-purple-200 transition-colors">
                      <link.icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <AutoTranslateText 
                        translationKey={link.labelKey} 
                        fallback={link.labelFallback}
                      />
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-6">
                  <p className="text-muted-foreground leading-relaxed">
                    <AutoTranslateText 
                      translationKey={link.descriptionKey} 
                      fallback={link.descriptionFallback}
                    />
                  </p>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl">
                    <Link href={link.href}>
                      <AutoTranslateText 
                        translationKey="superAdmin.goToPortal" 
                        fallback="Go to Portal"
                      />
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Management Sections */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl">
              <KeyRound className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">
              <AutoTranslateText 
                translationKey="superAdmin.accessSecurityManagement" 
                fallback="Access & Security"
              />
            </h2>
          </div>
          <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 p-6 border-b border-emerald-100 dark:border-emerald-800">
              <h3 className="text-lg font-semibold text-emerald-800 dark:text-emerald-200 flex items-center gap-3">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg">
                  <KeyRound className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <AutoTranslateText 
                  translationKey="superAdmin.ipRestriction" 
                  fallback="IP Access Restriction"
                />
              </h3>
            </div>
            <CardContent className="p-6 space-y-6">
                <div className="p-4 bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl border border-slate-200">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <Label htmlFor="ipUserId">
                              <AutoTranslateText 
                                translationKey="superAdmin.userIdBusinessCourier" 
                                fallback="User ID (Business/Courier)"
                              />
                            </Label>
                            <Input id="ipUserId" placeholder="user_id_123" value={ipUserId} onChange={(e) => setIpUserId(e.target.value)} />
                        </div>
                        <div>
                            <Label htmlFor="ipAddress">
                              <AutoTranslateText 
                                translationKey="superAdmin.authorizedIpAddress" 
                                fallback="Authorized IP Address"
                              />
                            </Label>
                            <Input id="ipAddress" placeholder="123.123.123.123" value={ipAddress} onChange={(e) => setIpAddress(e.target.value)} />
                        </div>
                    </div>
                    <Button 
                      onClick={handleAddIpRestriction} 
                      className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 rounded-lg"
                    >
                      <AutoTranslateText 
                        translationKey="superAdmin.addUpdateIpRestriction" 
                        fallback="Add/Update IP Restriction"
                      />
                    </Button>
                </div>
                <h4 className="text-md font-medium pt-2">
                  <AutoTranslateText 
                    translationKey="superAdmin.existingIpRestrictions" 
                    fallback="Existing IP Restrictions:"
                  />
                </h4>
                {isLoadingData ? <div className="flex justify-center py-4"><Loader2 className="h-6 w-6 animate-spin text-primary"/></div> : ipRestrictions.length === 0 ? <p className="text-xs text-muted-foreground text-center"><AutoTranslateText translationKey="superAdmin.noIpRestrictionsConfigured" fallback="No IP restrictions configured." /></p> :
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead><AutoTranslateText translationKey="superAdmin.user" fallback="User" /></TableHead>
                            <TableHead><AutoTranslateText translationKey="superAdmin.type" fallback="Type" /></TableHead>
                            <TableHead><AutoTranslateText translationKey="superAdmin.ipAddress" fallback="IP Address" /></TableHead>
                            <TableHead><AutoTranslateText translationKey="superAdmin.status" fallback="Status" /></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {ipRestrictions.map(r => (
                            <TableRow key={r.id + r.ip}>
                                <TableCell className="text-xs">{r.id}</TableCell>
                                <TableCell className="text-xs">
                                  <AutoTranslateText 
                                    translationKey={r.type === 'Business' ? 'superAdmin.business' : 'superAdmin.courier'} 
                                    fallback={r.type} 
                                  />
                                </TableCell>
                                <TableCell className="text-xs">{r.ip}</TableCell>
                                <TableCell className="text-xs">
                                  <Badge variant={r.status === 'Active' ? 'default' : 'outline'} className={r.status === 'Active' ? 'bg-green-100 text-green-700' : ''}>
                                    <AutoTranslateText 
                                      translationKey={r.status === 'Active' ? 'superAdmin.active' : 'superAdmin.inactive'} 
                                      fallback={r.status} 
                                    />
                                  </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>}
                 <Button 
                   variant="outline" 
                   className="w-full bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200 text-amber-700 hover:from-amber-100 hover:to-yellow-100 hover:border-amber-300 transition-all duration-200 shadow-sm rounded-lg" 
                   onClick={() => handlePlaceholderClick("WAF Rules Management")}
                 >
                   <div className="flex items-center gap-2">
                     <div className="p-1.5 bg-amber-100 rounded-lg">
                       <Settings2 className="h-4 w-4" />
                     </div>
                     <AutoTranslateText translationKey="superAdmin.wafRulesComingSoon" fallback="WAF Rules (Coming Soon)" />
                   </div>
                 </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-violet-500 to-purple-500 rounded-xl">
              <UserCog className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">
              <AutoTranslateText 
                translationKey="superAdmin.subscriptionOperatorManagement" 
                fallback="Subscription Management"
              />
            </h2>
          </div>
          <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30 p-6 border-b border-violet-100 dark:border-violet-800">
              <h3 className="text-lg font-semibold text-violet-800 dark:text-violet-200 flex items-center gap-3">
                <div className="p-2 bg-violet-100 dark:bg-violet-900/50 rounded-lg">
                  <UserCog className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                </div>
                <AutoTranslateText 
                  translationKey="superAdmin.updateSubscriptionStatus" 
                  fallback="Update Subscription Status"
                />
              </h3>
            </div>
            <CardContent className="p-6 space-y-6">
                 <div className="p-4 bg-gradient-to-r from-muted/50 to-muted/30 rounded-xl border border-border">
                     <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                        <div>
                            <Label htmlFor="subUserId">
                              <AutoTranslateText 
                                translationKey="superAdmin.userId" 
                                fallback="User ID"
                              />
                            </Label>
                            <Input id="subUserId" placeholder="business_id_456" value={subUserId} onChange={(e) => setSubUserId(e.target.value)} />
                        </div>
                        <div>
                            <Label htmlFor="subPlan">
                              <AutoTranslateText 
                                translationKey="superAdmin.selectPlan" 
                                fallback="Select Plan"
                              />
                            </Label>
                             <Select value={subPlan} onValueChange={setSubPlan}>
                                <SelectTrigger id="subPlan">
                                  <SelectValue placeholder={<AutoTranslateText translationKey="superAdmin.selectPlanPlaceholder" fallback="Select Plan..." />} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="basic_business"><AutoTranslateText translationKey="superAdmin.basicBusiness" fallback="Basic Business" /></SelectItem>
                                    <SelectItem value="pro_business"><AutoTranslateText translationKey="superAdmin.proBusiness" fallback="Pro Business" /></SelectItem>
                                    <SelectItem value="standard_courier"><AutoTranslateText translationKey="superAdmin.standardCourier" fallback="Standard Courier" /></SelectItem>
                                    <SelectItem value="premium_courier"><AutoTranslateText translationKey="superAdmin.premiumCourier" fallback="Premium Courier" /></SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                         <div>
                            <Label htmlFor="subStatus">
                              <AutoTranslateText 
                                translationKey="superAdmin.selectStatus" 
                                fallback="Select Status"
                              />
                            </Label>
                             <Select value={subStatus} onValueChange={setSubStatus}>
                                <SelectTrigger id="subStatus">
                                  <SelectValue placeholder={<AutoTranslateText translationKey="superAdmin.selectStatusPlaceholder" fallback="Select Status..." />} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active"><AutoTranslateText translationKey="superAdmin.active" fallback="Active" /></SelectItem>
                                    <SelectItem value="suspended"><AutoTranslateText translationKey="superAdmin.suspended" fallback="Suspended" /></SelectItem>
                                    <SelectItem value="expired"><AutoTranslateText translationKey="superAdmin.expired" fallback="Expired" /></SelectItem>
                                    <SelectItem value="cancelled"><AutoTranslateText translationKey="superAdmin.cancelled" fallback="Cancelled" /></SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <Button 
                      onClick={handleUpdateSubscription} 
                      className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 rounded-lg"
                    >
                      <AutoTranslateText 
                        translationKey="superAdmin.updateSubscription" 
                        fallback="Update Subscription"
                      />
                    </Button>
                </div>
                <h4 className="text-md font-medium pt-2">
                  <AutoTranslateText 
                    translationKey="superAdmin.sampleSubscriptions" 
                    fallback="Sample Subscriptions:"
                  />
                </h4>
                {isLoadingData ? <div className="flex justify-center py-4"><Loader2 className="h-6 w-6 animate-spin text-primary"/></div> : subscriptions.length === 0 ? <p className="text-xs text-muted-foreground text-center"><AutoTranslateText translationKey="superAdmin.noSubscriptionsDisplay" fallback="No subscriptions to display." /></p> :
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead><AutoTranslateText translationKey="superAdmin.nameId" fallback="Name/ID" /></TableHead>
                            <TableHead><AutoTranslateText translationKey="superAdmin.type" fallback="Type" /></TableHead>
                            <TableHead><AutoTranslateText translationKey="superAdmin.plan" fallback="Plan" /></TableHead>
                            <TableHead><AutoTranslateText translationKey="superAdmin.status" fallback="Status" /></TableHead>
                            <TableHead><AutoTranslateText translationKey="superAdmin.renewal" fallback="Renewal" /></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {subscriptions.map(s => (
                            <TableRow key={s.id}>
                                <TableCell className="text-xs">{s.name}</TableCell>
                                <TableCell className="text-xs">
                                  <AutoTranslateText 
                                    translationKey={s.type === 'Business' ? 'superAdmin.business' : 'superAdmin.courier'} 
                                    fallback={s.type} 
                                  />
                                </TableCell>
                                <TableCell className="text-xs">{s.plan}</TableCell>
                                <TableCell className="text-xs">
                                  <Badge variant={s.status === 'Active' ? 'default' : s.status === 'Expired' ? 'destructive' : 'secondary'} className={s.status === 'Active' ? 'bg-green-100 text-green-700' : ''}>
                                    <AutoTranslateText 
                                      translationKey={s.status === 'Active' ? 'superAdmin.active' : s.status === 'Expired' ? 'superAdmin.expired' : s.status === 'Suspended' ? 'superAdmin.suspended' : 'superAdmin.cancelled'} 
                                      fallback={s.status} 
                                    />
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-xs">{s.renewal}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>}
                <Button 
                  variant="outline" 
                  className="w-full bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200 text-amber-700 hover:from-amber-100 hover:to-yellow-100 hover:border-amber-300 transition-all duration-200 shadow-sm rounded-lg" 
                  onClick={() => handlePlaceholderClick("Global Subscription Plans Settings")}
                >
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-amber-100 rounded-lg">
                      <VenetianMask className="h-4 w-4" />
                    </div>
                    <AutoTranslateText translationKey="superAdmin.subscriptionPlansComingSoon" fallback="Subscription Plans (Coming Soon)" />
                  </div>
                </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Additional Tools */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl">
            <Settings className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">
            <AutoTranslateText 
              translationKey="superAdmin.additionalSystemManagementTools" 
              fallback="Additional System Management Tools"
            />
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {adminTools.map(tool => (
            <div key={tool.labelKey} className="group">
              <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-300 group-hover:scale-[1.02] rounded-2xl overflow-hidden cursor-pointer" onClick={tool.action}>
                <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30 p-6 border-b border-orange-100 dark:border-orange-800">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-orange-100 dark:bg-orange-900/50 rounded-xl group-hover:bg-orange-200 dark:group-hover:bg-orange-900/70 transition-colors">
                      <tool.icon className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground group-hover:text-orange-800 dark:group-hover:text-orange-200 transition-colors">
                        <AutoTranslateText 
                          translationKey={tool.labelKey} 
                          fallback={tool.labelFallback}
                        />
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">Coming Soon</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-gradient-to-r from-orange-500/5 to-red-500/5">
                  <div className="text-center">
                    <Badge variant="outline" className="bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-700 border-amber-200">
                      In Development
                    </Badge>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
      
      {/* System Status */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
            <Activity className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">
            <AutoTranslateText 
              translationKey="superAdmin.systemStatusDemo" 
              fallback="System Status"
            />
          </h2>
        </div>
        <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 p-6 border-b border-green-100 dark:border-green-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-100 dark:bg-green-900/50 rounded-xl">
                  <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-green-800 dark:text-green-200">
                    <AutoTranslateText 
                      translationKey="superAdmin.allSystemsOperational" 
                      fallback="All Systems Operational"
                    />
                  </h3>
                  <p className="text-green-600 dark:text-green-400 text-sm">
                    <AutoTranslateText 
                      translationKey="superAdmin.lastCheckNow" 
                      fallback="Last check: right now. Network traffic: moderate. Server load: low."
                    />
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-700 dark:text-green-300">Live</span>
              </div>
            </div>
          </div>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
                <div className="text-2xl font-bold text-blue-600">99.9%</div>
                <div className="text-sm text-blue-500">Uptime</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                <div className="text-2xl font-bold text-green-600">145ms</div>
                <div className="text-sm text-green-500">Response</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl">
                <div className="text-2xl font-bold text-purple-600">2.1K</div>
                <div className="text-sm text-purple-500">Active Users</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl">
                <div className="text-2xl font-bold text-orange-600">12%</div>
                <div className="text-sm text-orange-500">CPU Usage</div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="p-6 pt-0">
            <Button 
              variant="outline" 
              className="w-full bg-gradient-to-r from-slate-50 to-gray-50 border-slate-200 text-slate-700 hover:from-slate-100 hover:to-gray-100 hover:border-slate-300 transition-all duration-200 shadow-sm rounded-lg" 
              onClick={() => handlePlaceholderClick("Full System Status Page")}
            >
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-slate-100 rounded-lg">
                  <LinkIcon className="h-4 w-4" />
                </div>
                <AutoTranslateText 
                  translationKey="superAdmin.fullStatusPage" 
                  fallback="View Full Status Page"
                />
              </div>
            </Button>
          </CardFooter>
        </Card>
      </div>

    </div>
  );
}

    
