export interface SelectedItem {
  category: 'kids' | 'ladies' | 'mens';
  image: string;
  size: string;
}

export interface FormData {
  name: string;
  email: string;
  deliveryAddress: string;
  selectedItems: SelectedItem[];
}

export interface SizeOption {
  value: string;
  label: string;
  details: string;
}

export interface CategoryData {
  name: string;
  folder: string;
  images: string[];
  sizes: SizeOption[];
}

export interface PayPalPaymentData {
  orderID: string;
  payerID: string;
  paymentID: string;
} 