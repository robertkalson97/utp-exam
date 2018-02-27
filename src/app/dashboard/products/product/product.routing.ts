import { ProductComponent } from './product.component';
export const ProductRoutes = [
  {
    path: 'products/:id',
    component: ProductComponent,
    resolve: {
      // productCollection: ProductCollectionResolve,
    },
    canActivate: []
  },
];