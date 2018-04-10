import { NgModule } from '@angular/core';

import { OrdersPreviewComponent } from './orders-preview.component';
import { AppSharedModule } from '../../../shared/shared.module';
import { HttpClient } from '../../../core/services/http.service';
import { EditFaxDataModalModule } from './edit-fax-data-modal/edit-fax-data-modal.module';
import { WarningOrderModalComponent } from './warning-order-modal/warning-order-modal.component';
import { OnlineOrderModalComponent } from './online-order-modal/online-order-modal.component';

@NgModule({
  declarations: [
    OrdersPreviewComponent,
    WarningOrderModalComponent,
    OnlineOrderModalComponent
  ],
  entryComponents: [
    WarningOrderModalComponent,
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
