import { NgModule } from '@angular/core';

import { AppSharedModule } from '../../shared.module';
import { AddCustomProductModalComponent } from './add-custom-product-modal.component';
import { AddCustomProductModule } from '../../components/add-custom-product.module';

@NgModule({
  declarations: [
    AddCustomProductModalComponent,
  ],
  imports: [
    AppSharedModule,
    AddCustomProductModule,
  ],
  providers: [],
  exports: [
  ],
  // IMPORTANT:
  // Since 'AdditionCalculateWindow' is never explicitly used (in a template)
  // we must tell angular about it.
  entryComponents: [AddCustomProductModalComponent]
})
export class AddCustomProductModalModule {

}
