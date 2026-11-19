import React from 'react';
import { ManagementPage, ManagementPageConfig } from '../components/management/ManagementPage';

const riderConfig: ManagementPageConfig = {
  type: 'rider',
  title: 'Rider Management',
  subtitle: 'Manage delivery partners, availability and payouts',
  addBtnText: 'Add Rider',
  itemLabel: 'riders',
  categoriesOrVehicleTypes: [
    'Motorcycle',
    'Scooter',
    'Electric',
    'Bicycle',
    'On foot',
  ],
  filter1Label: 'Vehicle Type',
};

export const RidersPage: React.FC = () => {
  return <ManagementPage config={riderConfig} />;
};
