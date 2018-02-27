import { OrderComponent } from './order.component';
export const OrderRoutes = [
  {
    path: 'orders/:id',
    component: OrderComponent,
    canActivate: []
  },
];