import { EditVendorComponent } from './edit-vendor.component';
import { CurrentVendorResolve } from '../../../shared/resolves/main-resolve.service';
export const EditVendorRoutes = [
  {
    path: 'vendors/edit/:id',
    component: EditVendorComponent,
    resolve: { curVendor: CurrentVendorResolve
    },
    canActivate: []
  },
  {
    path: 'vendors/add',
    component: EditVendorComponent,
    resolve: {
    },
    canActivate: []
  },
];