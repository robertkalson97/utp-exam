import { NgModule } from '@angular/core';

import { ProductFilterModal } from './product-filter-modal.component';
import { AppSharedModule } from '../../../shared/shared.module';

@NgModule({
  declarations: [
    ProductFilterModal
  ],
  imports: [
    AppSharedModule
  ],
  providers: [],
  // IMPORTANT:
  // Since 'AdditionCalculateWindow' is never explicitly used (in a template)
  // we must tell angular about it.
  entryComponents: [ ProductFilterModal ]
})
export class ProductFilterModalModule {
}