import { NgModule } from '@angular/core';

import { OrdersPreviewComponent } from './orders-preview.component';
import { AppSharedModule } from '../../../shared/shared.module';

@NgModule({
  declarations: [
    OrdersPreviewComponent,
  ],
  imports: [
    AppSharedModule,
  ],
  providers: []
})
export class OrdersPreviewModule {
}