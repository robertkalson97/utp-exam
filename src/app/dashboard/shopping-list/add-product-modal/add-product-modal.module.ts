import { NgModule } from '@angular/core';

import { AddProductModal } from './add-product-modal.component';
import { AppSharedModule } from '../../../shared/shared.module';

@NgModule({
  declarations: [
    AddProductModal
  ],
  imports: [
    AppSharedModule
  ],
  providers: [],
  // IMPORTANT:
  // Since 'AdditionCalculateWindow' is never explicitly used (in a template)
  // we must tell angular about it.
  entryComponents: [ AddProductModal ]
})
export class AddProductModalModule {
}