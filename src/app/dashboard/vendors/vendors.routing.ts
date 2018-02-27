import { VendorsComponent } from './vendors.component';

import { ViewVendorRoutes } from './view-vendor/view-vendor.routing';
import { EditVendorRoutes } from './edit-vendor/edit-vendor.routing';

export const VendorsRoutes = [
  {
    path: 'vendors',
    component: VendorsComponent,
    resolve: {
    },
    canActivate: []
  },
  ...ViewVendorRoutes,
  ...EditVendorRoutes,
];