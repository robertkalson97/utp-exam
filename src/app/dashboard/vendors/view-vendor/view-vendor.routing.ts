import { ViewVendorComponent } from './view-vendor.component';
import { CurrentVendorResolve } from '../../../shared/resolves/main-resolve.service';
export const ViewVendorRoutes = [
  {
    path: 'vendors/view/:id',
    component: ViewVendorComponent,
    resolve: { curVendor: CurrentVendorResolve
    },
    canActivate: []
  },
];