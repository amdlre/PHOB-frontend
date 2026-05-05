export type SubscriptionStatus = 'active' | 'expired' | 'pending' | 'cancelled';

export type RequestStatus =
  | 'pending'
  | 'scheduled'
  | 'awaiting_guest_confirmation'
  | 'in_progress'
  | 'completed'
  | 'rejected'
  | 'cancelled';

export type CleaningType = 'regular' | 'deep' | 'checkout';

export type PackageId = 'basic' | 'standard' | 'premium' | 'studio' | 'one_br' | 'two_br';

export interface Package {
  id: PackageId;
  name: string;
  price: number;
  description: string;
  features: string[];
}

export interface PropertyImage {
  url: string;
  caption?: string;
}

export interface Property {
  id: string;
  owner_id: string;
  building_name: string;
  floor_number?: string;
  unit_number?: string;
  door_code?: string;
  address?: string;
  lat?: number;
  lng?: number;
  images: string[];
  active_subscription_id?: string;
  has_active_subscription: boolean;
  created_at?: string;
}

export interface Subscription {
  id: string;
  property_id: string;
  property_name?: string;
  package_id: PackageId;
  package_name?: string;
  status: SubscriptionStatus;
  start_date: string;
  end_date: string;
  price?: number;
  is_renewal?: boolean;
  created_at?: string;
}

export interface CleaningRequest {
  id: string;
  property_id: string;
  property_name?: string;
  client_id?: string;
  client_name?: string;
  client_phone?: string;
  client_email?: string;
  subscription_id?: string;
  scheduled_at: string;
  status: RequestStatus;
  cleaning_type?: CleaningType;
  notes?: string;
  guest_confirmed_at?: string;
  created_at: string;
  updated_at?: string;
  report?: VisitReport;
}

export interface VisitReport {
  id?: string;
  request_id: string;
  rooms_done: boolean;
  kitchen_done: boolean;
  bathrooms_done: boolean;
  linens_done: boolean;
  before_images: string[];
  after_images: string[];
  general_notes?: string;
  damage_notes?: string;
  maintenance_notes?: string;
  items_missing: boolean;
  missing_description?: string;
  missing_images?: string[];
  created_at?: string;
}

export interface Notification {
  id: string;
  type:
    | 'new_request'
    | 'guest_confirmed'
    | 'subscription_expiring'
    | 'report_pending'
    | 'request_status';
  title: string;
  body?: string;
  read: boolean;
  link?: string;
  created_at: string;
}
