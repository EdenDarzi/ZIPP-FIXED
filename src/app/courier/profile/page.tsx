
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Shield, Edit3, LogOut, Bike, Car, Footprints, AlertTriangle } from 'lucide-react';
import { mockCourierProfiles } from '@/lib/mock-data'; // Assuming this exists
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

// Mock current courier (replace with actual auth and data fetching)
const MOCK_CURRENT_COURIER_ID = 'courier1'; // Speedy Sam

export default function CourierProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const courier = mockCourierProfiles.find(c => c.id === MOCK_CURRENT_COURIER_ID);

  if (!courier) {
    // Handle case where courier is not found, though with mock data this is unlikely
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
            <AlertTriangle className="h-16 w-16 text-destructive mb-4" />
            <h1 className="text-2xl font-bold">Courier Profile Not Found</h1>
            <p className="text-muted-foreground mb-6">We couldn't load the courier details.</p>
            <Button onClick={() => router.push('/courier/open-bids')}>Back to Open Bids</Button>
        </div>
    );
  }

  const handleSaveChanges = () => {
    toast({
      title: "Profile Updated (Mock)",
      description: "Your profile changes have been saved.",
    });
  };

  const VehicleIcon = ({ type }: { type: typeof courier.vehicleType }) => {
    if (type === 'motorcycle') return <Bike className="h-5 w-5 text-primary" />;
    if (type === 'car') return <Car className="h-5 w-5 text-primary" />;
    if (type === 'bicycle') return <Bike className="h-5 w-5 text-primary" />;
    if (type === 'foot') return <Footprints className="h-5 w-5 text-primary" />;
    if (type === 'scooter') return <Bike className="h-5 w-5 text-primary" />; // Using Bike for Scooter as well
    return null;
  };


  return (
    <div className="max-w-2xl mx-auto py-8 space-y-6">
      <Card className="shadow-xl">
        <CardHeader className="items-center text-center">
          <Avatar className="h-24 w-24 mb-4 border-4 border-primary shadow-lg">
            <AvatarImage src={`https://placehold.co/100x100.png?text=${courier.name.substring(0,1)}`} alt={courier.name} data-ai-hint="courier person" />
            <AvatarFallback>{courier.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <CardTitle className="text-3xl font-headline text-primary">{courier.name}</CardTitle>
          <CardDescription className="text-lg">ID: {courier.id}</CardDescription>
          <div className="flex items-center space-x-2 mt-2">
            <VehicleIcon type={courier.vehicleType} />
            <span className="capitalize text-muted-foreground">{courier.vehicleType} - {courier.transportationModeDetails || 'N/A'}</span>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <Label htmlFor="email">Email (Read-only)</Label>
              <Input id="email" defaultValue={`${courier.id}@example.com`} readOnly />
              <p className="text-xs text-muted-foreground">Email cannot be changed.</p>
            </div>
            <div className="space-y-1">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" defaultValue="050-1234567" />
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Operational Settings</h3>
            <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <Label htmlFor="isActive" className="text-base">Active for Deliveries</Label>
                <p className="text-sm text-muted-foreground">
                  Toggle to start or stop receiving new delivery offers.
                </p>
              </div>
              <Switch id="isActive" defaultChecked={courier.isActive} />
            </div>
             <div className="space-y-1">
                <Label htmlFor="coverageRadius">Coverage Radius (km)</Label>
                <Input id="coverageRadius" type="number" defaultValue={courier.areaCoverageRadiusKm} />
                <p className="text-xs text-muted-foreground">Maximum distance you are willing to travel for pickup.</p>
            </div>
            { (courier.vehicleType === 'scooter' || courier.vehicleType === 'bicycle' && courier.batteryPercent) &&
                <div className="space-y-1">
                    <Label htmlFor="battery">Current Battery (%) (Read-only)</Label>
                    <Input id="battery" value={courier.batteryPercent} readOnly />
                    <p className="text-xs text-muted-foreground">For electric vehicles, updated automatically.</p>
                </div>
            }
          </div>

          <Separator />
          
          <div className="space-y-2">
             <h3 className="text-lg font-semibold">Performance</h3>
             <div className="flex justify-around p-2 bg-muted/50 rounded-md">
                <div className="text-center">
                    <p className="text-2xl font-bold text-primary">{courier.rating.toFixed(1)}</p>
                    <p className="text-xs text-muted-foreground">Avg. Rating</p>
                </div>
                 <div className="text-center">
                    <p className="text-2xl font-bold text-primary">{courier.trustScore}%</p>
                    <p className="text-xs text-muted-foreground">Trust Score</p>
                </div>
             </div>
          </div>


          <Button onClick={handleSaveChanges} className="w-full mt-4 bg-primary hover:bg-primary/90">
            <Edit3 className="mr-2 h-4 w-4" /> Save Changes (Mock)
          </Button>
        </CardContent>
         <CardFooter className="border-t pt-4 flex flex-col gap-2">
            <Button variant="outline" className="w-full"><Shield className="mr-2 h-4 w-4" /> Security Settings (Soon)</Button>
            <Button variant="destructive-outline" className="w-full" onClick={() => router.push('/')}><LogOut className="mr-2 h-4 w-4"/> Logout (Mock)</Button>
         </CardFooter>
      </Card>
    </div>
  );
}

    