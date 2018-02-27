import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NoContentComponent } from './no-content/index';
import { AppComponent } from './app.component';

// routings
import { AuthRoutes } from './auth/index';
import { DashboardRoutes } from './dashboard/dashboard.routing';
import { OnboardRoutes } from './onboard/onboard.routing';


const appRoutes = [
  {
    path: '',
    component: AppComponent,
    children: [
      { path: '', redirectTo: "/login", pathMatch: "full" },

      ...AuthRoutes,
      ...DashboardRoutes,
      ...OnboardRoutes
    ]
  },
  { path: '**', component: NoContentComponent }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);