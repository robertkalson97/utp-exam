import { DashboardComponent } from './dashboard.component';

import {
    UserCollectionResolve,
    LocationCollectionResolve,
    VendorCollectionResolve,
    AccountVendorCollectionResolve,
    ProductCollectionResolve,
} from '../shared/resolves/index';

import { InnerDashboardRoutes } from './inner-dashboard/inner-dashboard.routing';
import { OrdersRoutes } from './orders/orders.routing';
import { LocationsRoutes } from './locations/locations.routing';
import { UsersRoutes } from './users/users.routing';
import { VendorsRoutes } from './vendors/vendors.routing';
import { ProductsRoutes } from './products/products.routing';
import { InventoryRoutes } from "./inventory/inventory.routing";
import { TransferRoutes } from "./transfer/transfer.routing";
import { ShoppingListRoutes } from "./shopping-list/shopping-list.routing";
import { AuthGuard } from '../auth-guard.service';
import { OrdersPreviewRoutes } from './shopping-list/orders-preview/orders-preview.routing';
import { PurchaseOrderRoutes } from './shopping-list/orders-preview/purchase-order/purchase-order.routing';
import { ReportsRoutes } from './reports/reports.routing';
import { AppliancesRoutes } from './appliances/appliances.routing';
import { AssetsRoutes } from './assets/assets.routing';
import { RestockFloorRoutes } from './restock-floor/restock-floor.routing';


export const DashboardRoutes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      ...AppliancesRoutes,
      ...AssetsRoutes,
      ...InnerDashboardRoutes,
      ...OrdersRoutes,
      ...LocationsRoutes,
      ...UsersRoutes,
      ...VendorsRoutes,
      ...ProductsRoutes,
      ...InventoryRoutes,
      ...TransferRoutes,
      ...ReportsRoutes,
      ...ShoppingListRoutes,
      ...OrdersPreviewRoutes,
      ...PurchaseOrderRoutes,
      ...RestockFloorRoutes
    ],
    canActivate: [AuthGuard],
    resolve: {
      accountVendorCollection: AccountVendorCollectionResolve,
      vendorCollection: VendorCollectionResolve,
      userCollection: UserCollectionResolve,
      locationCollection: LocationCollectionResolve,
      //productCollection: ProductCollectionResolve,
    }
  }
];

