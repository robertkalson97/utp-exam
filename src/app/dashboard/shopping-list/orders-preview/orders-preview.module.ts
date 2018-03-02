import { NgModule } from '@angular/core';

import { OrdersPreviewComponent } from './orders-preview.component';
import { AppSharedModule } from '../../../shared/shared.module';
import { HttpClient } from '../../../core/services/http.service';
import { EditFaxDataModalModule } from './edit-fax-data-modal/edit-fax-data-modal.module';
import { PhoneOrderModalComponent } from './phone-order-modal/phone-order-modal.component';
import { OnlineOrderModalComponent } from './online-order-modal/online-order-modal.component';

@NgModule({
  declarations: [
    OrdersPreviewComponent,
    PhoneOrderModalComponent,
    OnlineOrderModalComponent
  ],
  entryComponents: [
    PhoneOrderModalComponent,
    OnlineOrderModalComponent
  ],
  imports: [
    AppSharedModule,
    EditFaxDataModalModule
  ],
  providers: [
    HttpClient
  ]
})
export class OrdersPreviewModule {
}