// Subscription types for the ZIPP application

export interface Subscription {
  id: string;
  userId: string;
  status: SubscriptionStatus;
  plan: SubscriptionPlan;
  startDate: Date;
  endDate?: Date;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
}

export type SubscriptionStatus = 'active' | 'cancelled' | 'pending' | 'trial';

export type SubscriptionPlanType = 'CUSTOMER' | 'BUSINESS' | 'COURIER';

export type SubscriptionPricingType = 'MONTHLY_FLAT' | 'PER_ORDER' | 'ANNUAL_FLAT';

export type SubscriptionBillingCycle = 'MONTHLY' | 'ANNUALLY';

export interface SubscriptionPlan {
  id: string;
  name: string;
  type: SubscriptionPlanType;
  pricingType: SubscriptionPricingType;
  amount: number;
  currency: string;
  billingCycle?: SubscriptionBillingCycle;
  features: string[];
  benefits: string[];
  description?: string;
}
