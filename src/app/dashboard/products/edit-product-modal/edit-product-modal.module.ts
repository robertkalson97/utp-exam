import { NgModule } from '@angular/core';

import { EditProductModal } from './edit-product-modal.component';
import { AppSharedModule } from '../../../shared/shared.module';

@NgModule({
  declarations: [
    EditProductModal
  ],
  imports: [
    AppSharedModule
  ],
  providers: [],
  // IMPORTANT:
  // Since 'AdditionCalculateWindow' is never explicitly used (in a template)
  // we must tell angular about it.
  entryComponents: [ EditProductModal ]
})
export class EditProductModalModule {
}