import { ShoppingListComponent } from './shopping-list.component';


export const ShoppingListRoutes = [
  {
    path: 'shoppinglist',
    component: ShoppingListComponent,
    resolve: {
    },
    children: [
    ],
    canActivate: []
  },
];