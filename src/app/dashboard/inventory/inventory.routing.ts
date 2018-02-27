import { InventoryComponent } from './inventory.component';
import { InventoryItemRoutes } from './inventory-item/inventory-item.routing';
import { InventoryPackageListResolve } from '../../shared/resolves/main-resolve.service';

export const InventoryRoutes = [
  {
    path: 'inventory',
    component: InventoryComponent,
    resolve: {
      productCollection: InventoryPackageListResolve,
    },
    canActivate: [],
  },
  ...InventoryItemRoutes
];