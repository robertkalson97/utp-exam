import { ProductsComponent } from './products.component';
import { ProductRoutes } from './product/product.routing';
import { ProductCollectionResolve } from '../../shared/resolves/main-resolve.service';

export const ProductsRoutes = [
  {
    path: 'products',
    component: ProductsComponent,
    resolve: {
       productCollection: ProductCollectionResolve,
    },
    canActivate: [],
  },
  ...ProductRoutes,

];