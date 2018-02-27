import { NgModule } from '@angular/core';

import { ProductsComponent } from './products.component';
import { AppSharedModule } from '../../shared/shared.module';

import { ProductModal } from './product-modal/product-modal.component';

@NgModule({
  declarations: [
    ProductsComponent,
    ProductModal
  ],
  imports: [
    AppSharedModule
  ],
  providers: [],
  // IMPORTANT:
  // Since 'AdditionCalculateWindow' is never explicitly used (in a template)
  // we must tell angular about it.
  entryComponents: [ ProductModal ]
})
export class ProductsModule {
}