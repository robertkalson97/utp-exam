import { AuthComponent } from './auth.component';
import { AuthGuard } from '../auth-guard.service';

import { EmailVerificationRoutes } from './email-verification/email-verification.routing';

import { ForgotPasswordRoutes } from './forgot-password/forgot-password.routing';
import { ForgotPasswordCongratsRoutes } from './forgot-password-congrats/forgot-password-congrats.routing';
import { LoginRoutes } from './login/login.routing';
import { SignupRoutes } from './signup/signup.routing';
import { ResetPasswordRoutes } from './reset-password/reset-password.routing';
import { InviteRoutes } from './invite/invite.routing';
import { SSORoutes } from './sso/sso.routing';

export const AuthRoutes = [
  {
    path: '',
    component: AuthComponent,
    children: [
      ...EmailVerificationRoutes,
      ...ForgotPasswordRoutes,
      ...ForgotPasswordCongratsRoutes,
      ...LoginRoutes,
      ...SignupRoutes,
      ...ResetPasswordRoutes,
      ...InviteRoutes,
      ...SSORoutes
    ]
  }
];