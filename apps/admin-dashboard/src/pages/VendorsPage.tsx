import React from 'react';
import { ManagementPage, ManagementPageConfig } from '../components/management/ManagementPage';

const vendorConfig: ManagementPageConfig = {
  type: 'vendor',
  title: 'Vendor Management',
  subtitle: 'Manage local vendors, their stores and payouts',
  addBtnText: 'Add Vendor',
  itemLabel: 'vendors',
  categoriesOrVehicleTypes: [
    'Grocery',
    'Dairy',
    'Pharmacy',
    'Fresh Produce',
    'Bakery',
    'Beverages & Snacks',
    'Sweets & Snacks',
    'Organic Store',
  ],
  filter1Label: 'Category',
};

export const VendorsPage: React.FC = () => {
  return <ManagementPage config={vendorConfig} />;
};
