export interface BusinessAbout {
  name: string;
  short_name: string;
  details: string;
  slogan: string;
  address: string;
  founded_in: string;
  email?: string;
  phone_number?: string;
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  instagram?: string;
  tiktok?: string;
  youtube?: string;
  logo?: string;
  wallpaper?: string;
  services?: string[];
  business_hours?: string;
}

export interface ServiceOffered {
  name: string;
  description: string;
  picture: string;
  starting_price: number;
  ending_price: number;
}

export interface ShallowCompletedOrder {
  id: number;
  picture: string;
}

export interface CompletedOrderDetail extends ShallowCompletedOrder {
  service_name: string;
  details: string;
  material_type: string;
  fabric_required: boolean;
  reference_image: string;
  charges: number;
  created_at: string;
}

export interface UserFeedback {
  id: number;
  message: string;
  rate: string;
  created_at: string;
  updated_at: string;
  user: {
    first_name?: string;
    last_name?: string;
    role: string;
    profile?: string;
  };
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface UserProfile {
  first_name: string | null;
  last_name: string | null;
  phone_number: string | null;
  email: string | null;
  location: string | null;
  username: string;
  date_of_birth: string;
  gender: 'M' | 'F' | 'O';
  profile: string | null;
  is_staff: boolean;
  date_joined: string;
}

export interface UserMeasurements {
  chest: number;
  waist: number;
  hips: number;
  inseam: number;
  neck: number;
  sleeve_length: number;
  shoulder_width: number;
  thigh: number;
  calf: number;
  date_created?: string;
  date_updated?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface RegisterFormData {
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: 'M' | 'F' | 'O';
  username: string;
  email: string;
  phone_number: string;
  location: string;
  password: string;
}

export interface ShallowUserOrderDetails {
  id: number;
  service_name: string;
  quantity: number;
  charges: number | null;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';
}

export interface UserOrderDetails extends CompletedOrderDetail, ShallowUserOrderDetails {
  urgency: 'Low' | 'Medium' | 'High';
  charges_paid: number;
  updated_at: string;
}

export interface NewOrderData {
  service_name: string;
  details: string;
  material_type: string;
  fabric_required: boolean;
  quantity: number;
  reference_image?: File;
  colors?: string;
  urgency: 'Low' | 'Medium' | 'High';
}