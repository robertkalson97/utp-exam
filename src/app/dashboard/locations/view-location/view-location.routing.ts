import { ViewLocationComponent } from './view-location.component';
export const ViewLocationRoutes = [
  {
    path: 'locations/view/:id',
    component: ViewLocationComponent,
    resolve: {
    },
    canActivate: []
  },
];