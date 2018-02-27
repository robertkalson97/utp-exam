import { LocationsComponent } from './locations.component';
import {
    StateCollectionResolve,
    LocationTypesCollectionResolve
} from '../../shared/resolves/index';
import { ViewLocationRoutes } from './view-location/view-location.routing';
import { EditLocationRoutes } from './edit-location/edit-location.routing';

export const LocationsRoutes = [
  {
    path: 'locations',
    component: LocationsComponent,
    canActivate: [],
    resolve: {
      stateCollection: StateCollectionResolve,
      locationTypesCollection: LocationTypesCollectionResolve
    }
  },
  ...ViewLocationRoutes,
  ...EditLocationRoutes
  
];