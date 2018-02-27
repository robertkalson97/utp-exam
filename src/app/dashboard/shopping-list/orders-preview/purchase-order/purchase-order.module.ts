import { NgModule } from '@angular/core';

import { PurchaseOrderComponent } from './purchase-order.component';
import { AppSharedModule } from '../../../../shared/shared.module';
import { EditEmailDataModalModule } from './edit-email-data-modal/edit-email-data-modal.module';

@NgModule({
  declarations: [
    PurchaseOrderComponent,
  ],
  imports: [
    AppSharedModule,
    EditEmailDataModalModule
  ],
  providers: [],
})
export class PurchaseOrderModule {
}