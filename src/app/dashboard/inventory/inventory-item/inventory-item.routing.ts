import { InventoryItemComponent } from './inventory-item.component';
export const InventoryItemRoutes = [
  {
    path: 'inventory/item/:id',
    component: InventoryItemComponent,
    resolve: {
    },
    canActivate: []
  },
];