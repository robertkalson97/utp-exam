import { UsersComponent } from './users.component';
import {
  DepartmentCollectionResolve,
  RoleCollectionResolve
} from '../../shared/resolves/index';
import { ViewUserRoutes } from './view-user/view-user.routing';
import { EditUserRoutes } from './edit-user/edit-user.routing';

export const UsersRoutes = [
  {
    path: 'users',
    component: UsersComponent,
    resolve: {
      departmentCollection: DepartmentCollectionResolve,
      permissionCollection: RoleCollectionResolve
    },
    canActivate: [],
  },
  ...ViewUserRoutes,
  ...EditUserRoutes,
];