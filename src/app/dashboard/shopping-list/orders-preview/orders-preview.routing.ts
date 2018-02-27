import { OrdersPreviewComponent } from './orders-preview.component';


export const OrdersPreviewRoutes = [
  {
    path: 'shoppinglist/orders-preview/:id',
    component: OrdersPreviewComponent,
    canActivate: []
  },
];