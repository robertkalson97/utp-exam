import { EmailVerificationComponent } from './email-verification.component';

export const EmailVerificationRoutes = [
  {
    path: 'email-verification/:token',
    component: EmailVerificationComponent,
    canActivate: []
  },
  {
    path: 'email-verification',
    component: EmailVerificationComponent,
    canActivate: []
  }
];