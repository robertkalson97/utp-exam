import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// import { SignupStepsAuthGuard } from '../../singup-steps-auth-guard.service';
import { AuthGuard } from '../../auth-guard.service';
import { SignupComponent } from './signup.component';

import { AboutCompanyRoutes } from './about-company/about-company.routing';
import { CreateAccountRoutes } from './create-account/create-account.routing';
import { PaymentInfoRoutes } from './payment-info/payment-info.routing';
import { CongratsRoutes } from './congrats/congrats.routing';

export const SignupRoutes = [
  {
    path: 'signup',
    component: SignupComponent,
    resolve: {},
    children: [
      ...AboutCompanyRoutes,
      ...CreateAccountRoutes,
      ...PaymentInfoRoutes,
      ...CongratsRoutes
    ],
    canActivateChild: [ AuthGuard ],
    canActivate: [AuthGuard]
  }
];

//export const routing: ModuleWithProviders = RouterModule.forChild(signupRoutes);