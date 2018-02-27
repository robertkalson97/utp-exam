import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OnboardComponent } from './onboard.component';

// resolves
import {
    StateCollectionResolve,
    LocationTypesCollectionResolve,
    LocationCollectionResolve,
    UserCollectionResolve,
    DepartmentCollectionResolve,
    RoleCollectionResolve,
    CurrencyCollectionResolve
} from '../shared/resolves/index';

import { OnboardLocationsRoutes } from './locations/locations.routing';
import { OnboardUsersRoutes } from './users/users.routing';
import { AccountingRoutes } from './accounting/accounting.routing';
import { AuthGuard } from '../auth-guard.service';

export const OnboardRoutes = [
  {
    path: 'onboard',
    component: OnboardComponent,
    children: [
      ...OnboardLocationsRoutes,
      ...OnboardUsersRoutes,
      ...AccountingRoutes
    ],
    canActivate: [AuthGuard],
    resolve: {
      // for locations
      stateCollection: StateCollectionResolve,
      locationTypesCollection: LocationTypesCollectionResolve,
      locationCollection: LocationCollectionResolve,
      // for users
      userCollection: UserCollectionResolve,
      departmentCollection: DepartmentCollectionResolve,
      permissionCollection: RoleCollectionResolve,
      // for accounting
      currencyCollection: CurrencyCollectionResolve
    }
  }
];

//export const routing: ModuleWithProviders = RouterModule.forChild(onboardRoutes);