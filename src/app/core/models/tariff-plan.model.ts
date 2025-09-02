export interface TariffPlan {
  name: string;
  price: string;
  description: string;
  features: string[];
  highlight?: boolean;
  payUrl?: string;
}

