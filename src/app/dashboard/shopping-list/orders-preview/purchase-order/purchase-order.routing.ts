import { PurchaseOrderComponent } from './purchase-order.component';


export const PurchaseOrderRoutes = [
  {
    path: 'shoppinglist/purchase/:id',
    component: PurchaseOrderComponent,
    canActivate: []
  },
];