import { NgModule } from '@angular/core';

import { RequestProductModal } from './request-product-modal.component';
import { AppSharedModule } from '../../../shared/shared.module';

@NgModule({
  declarations: [
    RequestProductModal
  ],
  imports: [
    AppSharedModule
  ],
  providers: [],
  // IMPORTANT:
  // Since 'AdditionCalculateWindow' is never explicitly used (in a template)
  // we must tell angular about it.
  entryComponents: [ RequestProductModal ]
})
export class RequestProductModalModule {
}