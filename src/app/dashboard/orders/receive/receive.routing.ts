import { ReceiveComponent } from './receive.component';
import { StatusListResolve } from '../../../shared/resolves/main-resolve.service';

export const ReceiveRoutes = [
  {
    path: 'orders/receive/:queryParams',
    component: ReceiveComponent,
    resolve: {
      statusList: StatusListResolve,
    },
  }
];