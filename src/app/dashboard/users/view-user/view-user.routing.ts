import { ViewUserComponent } from './view-user.component';
export const ViewUserRoutes = [
  {
    path: 'users/view/:id',
    component: ViewUserComponent,
    resolve: {
    },
    canActivate: []
  },
];