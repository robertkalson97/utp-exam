import { EditLocationComponent } from './edit-location.component';
export const EditLocationRoutes = [
  {
    path: 'locations/edit/:id',
    component: EditLocationComponent,
    resolve: {
    },
    canActivate: []
  },
  {
    path: 'locations/add',
    component: EditLocationComponent,
    resolve: {
    },
    canActivate: []
  },
];