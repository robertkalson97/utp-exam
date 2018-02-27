import { NgModule } from '@angular/core';

import { ViewProductModal } from './view-product-modal.component';
import { AppSharedModule } from '../../../shared/shared.module';

@NgModule({
  declarations: [
    ViewProductModal
  ],
  imports: [
    AppSharedModule
  ],
  providers: [],
  // IMPORTANT:
  // Since 'AdditionCalculateWindow' is never explicitly used (in a template)
  // we must tell angular about it.
  entryComponents: [ ViewProductModal ]
})
export class ViewProductModalModule {
}