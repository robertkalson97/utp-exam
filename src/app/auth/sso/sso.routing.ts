import { SSOComponent } from './sso.component';
import { AuthGuard } from '../../auth-guard.service';

export const SSORoutes = [
  {
    path: 'sso',
    component: SSOComponent,
    canActivate: [AuthGuard]
  },
];