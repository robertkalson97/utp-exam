import { OrdersComponent } from './orders.component';
import { ReceiveRoutes } from './receive/receive.routing';
import { OrderRoutes } from './order/order.routing';
import { ReconcileRoutes } from './reconcile/reconcile.routing';

export const OrdersRoutes = [
  {
    path: 'orders',
    component: OrdersComponent,
    canActivate: [],
  },
  ...ReceiveRoutes,
  ...ReconcileRoutes,
  ...OrderRoutes,
];