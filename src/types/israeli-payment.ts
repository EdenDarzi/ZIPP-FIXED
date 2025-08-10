// Israeli Payment Types for ZIPP Platform

export interface IsraeliPaymentMethod {
  id: string;
  type: 'credit_card' | 'bit' | 'bank_transfer' | 'paybox' | 'digital_wallet';
  name: string;
  isDefault: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreditCardDetails {
  cardNumber: string; // Masked: ****-****-****-1234
  cardholderName: string;
  expiryMonth: string;
  expiryYear: string;
  cardType: 'visa' | 'mastercard' | 'american_express' | 'diners' | 'isracard';
  issuingBank: string;
  lastFourDigits: string;
}

export interface BitDetails {
  phoneNumber: string;
  bankName: string;
  accountType: 'checking' | 'savings';
  verificationStatus: 'verified' | 'pending' | 'failed';
}

export interface BankTransferDetails {
  bankCode: string;
  bankName: string;
  branchCode: string;
  accountNumber: string; // Masked
  accountHolderName: string;
  accountType: 'checking' | 'savings' | 'business';
  swiftCode?: string;
}

export interface PayboxDetails {
  merchantId: string;
  terminalId: string;
  apiKey: string; // Encrypted
  isLive: boolean;
  supportedCurrencies: string[];
}

export interface WalletBalance {
  currency: 'ILS' | 'USD' | 'EUR';
  available: number;
  pending: number;
  total: number;
  lastUpdated: Date;
}

export interface WalletTransaction {
  id: string;
  type: 'credit' | 'debit' | 'transfer' | 'refund' | 'fee';
  amount: number;
  currency: string;
  description: string;
  reference?: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  createdAt: Date;
  processedAt?: Date;
  metadata?: Record<string, any>;
}

export interface DigitalWallet {
  id: string;
  userId: string;
  balance: WalletBalance;
  isActive: boolean;
  tier: 'basic' | 'premium' | 'business';
  limits: {
    dailyLimit: number;
    monthlyLimit: number;
    perTransactionLimit: number;
  };
  linkedPaymentMethods: IsraeliPaymentMethod[];
  createdAt: Date;
  updatedAt: Date;
}

// Israeli specific payment providers
export type IsraeliPaymentProvider = 
  | 'tranzila'
  | 'paybox'
  | 'bit'
  | 'isracard'
  | 'cal'
  | 'leumi_card'
  | 'max'
  | 'hapoalim'
  | 'mizrahi';

export interface PaymentConfiguration {
  provider: IsraeliPaymentProvider;
  isLive: boolean;
  credentials: {
    apiKey: string;
    secretKey: string;
    merchantId?: string;
    terminalId?: string;
  };
  supportedMethods: IsraeliPaymentMethod['type'][];
  fees: {
    percentage: number;
    fixed: number;
    currency: string;
  };
}

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  orderId: string;
  customerId: string;
  paymentMethodId: string;
  status: 'pending' | 'processing' | 'succeeded' | 'failed' | 'cancelled';
  failureReason?: string;
  createdAt: Date;
  updatedAt: Date;
  metadata?: Record<string, any>;
}